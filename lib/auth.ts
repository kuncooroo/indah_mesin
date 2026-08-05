import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import type { AdminRole } from "@prisma/client";
import { authCookieOptions } from "@/lib/auth-cookies";

/** Role di session JWT: USER = storefront, ADMIN/SUPERADMIN = panel. */
export type AppRole = "USER" | AdminRole;

async function applyJwt(
  token: Record<string, unknown>,
  user?: { id: string; username?: string; role?: AppRole } | null,
  account?: { provider?: string } | null,
  trigger?: string,
  session?: { name?: string; email?: string; image?: string | null } | null
) {
  if (user) {
    token.sub = user.id;
    token.username = user.username;
    token.role = user.role ?? "USER";
  }
  if (account?.provider) {
    token.authProvider = account.provider;
  }
  if (trigger === "update" && session) {
    if (session.name) token.name = session.name;
    if (session.email) token.email = session.email;
    if ("image" in session) token.picture = session.image ?? undefined;
  }
  return token;
}

const storefrontProviders: NextAuthOptions["providers"] = [
  CredentialsProvider({
    id: "credentials",
    name: "Credentials",
    credentials: {
      username: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
      portal: { label: "Portal", type: "text" },
    },
    async authorize(credentials) {
      const username = credentials?.username?.trim();
      const password = credentials?.password;
      if (!username || !password) return null;

      const phoneCandidates = new Set([username]);
      const looksLikePhone = /^[+\d\s().-]+$/.test(username);
      const phoneDigits = username.replace(/\D/g, "");
      const canonicalPhone = phoneDigits.startsWith("0")
        ? `62${phoneDigits.slice(1)}`
        : phoneDigits;
      if (phoneDigits.startsWith("0")) {
        phoneCandidates.add(`+62 ${phoneDigits.slice(1)}`);
        phoneCandidates.add(`+62${phoneDigits.slice(1)}`);
      } else if (phoneDigits.startsWith("62")) {
        phoneCandidates.add(`+${phoneDigits}`);
        phoneCandidates.add(`+62 ${phoneDigits.slice(2)}`);
      }

      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email: username.toLowerCase() },
            ...Array.from(phoneCandidates, (phone) => ({ phone })),
          ],
        },
      });
      if (!user && looksLikePhone && canonicalPhone.length >= 8) {
        const possiblePhoneUsers = await prisma.user.findMany({
          where: { phone: { endsWith: canonicalPhone.slice(-4) } },
          take: 20,
        });
        user =
          possiblePhoneUsers.find((candidate) => {
            const digits = candidate.phone?.replace(/\D/g, "") ?? "";
            const candidatePhone = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
            return candidatePhone === canonicalPhone;
          }) ?? null;
      }
      if (!user || !(await bcrypt.compare(password, user.password))) return null;

      return {
        id: user.id,
        name: user.name ?? user.username ?? user.email,
        email: user.email,
        image: user.avatar ?? undefined,
        username: user.username ?? undefined,
        role: "USER" as const,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  storefrontProviders.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    })
  );
}

/** Session pembeli storefront — cookie terpisah dari admin. */
export const storefrontAuthOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/profile" },
  providers: storefrontProviders,
  cookies: authCookieOptions("storefront"),
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;
      const password = await bcrypt.hash(crypto.randomUUID(), 10);
      await prisma.user.upsert({
        where: { email: user.email },
        create: {
          name: user.name ?? user.email.split("@")[0],
          email: user.email,
          password,
          avatar: user.image,
        },
        update: {
          name: user.name ?? undefined,
          avatar: user.image ?? undefined,
        },
      });
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      await applyJwt(
        token as Record<string, unknown>,
        user as { id: string; username?: string; role?: AppRole } | undefined,
        account,
        trigger,
        session as { name?: string; email?: string; image?: string | null } | undefined
      );
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: String(token.email) } });
        if (dbUser) {
          token.sub = dbUser.id;
          token.username = dbUser.username ?? undefined;
          token.role = "USER";
          token.picture = dbUser.avatar ?? token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.username = (token.username as string) ?? "";
        session.user.role = (token.role as AppRole) ?? "USER";
        session.user.authProvider = token.authProvider;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = token.picture ?? null;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

/** Session panel admin — cookie terpisah dari storefront. */
export const adminAuthOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        portal: { label: "Portal", type: "text" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim();
        const password = credentials?.password;
        if (!username || !password) return null;

        const admin = await prisma.admin.findFirst({
          where: {
            OR: [{ username }, { email: username.toLowerCase() }],
          },
        });
        if (!admin || !(await bcrypt.compare(password, admin.password))) return null;
        return {
          id: admin.id,
          name: admin.name ?? admin.username ?? admin.email,
          email: admin.email,
          image: admin.avatar ?? undefined,
          username: admin.username ?? undefined,
          role: admin.role,
        };
      },
    }),
  ],
  cookies: authCookieOptions("admin"),
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      await applyJwt(
        token as Record<string, unknown>,
        user as { id: string; username?: string; role?: AppRole } | undefined,
        account,
        trigger,
        session as { name?: string; email?: string; image?: string | null } | undefined
      );
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.username = (token.username as string) ?? "";
        session.user.role = (token.role as AppRole) ?? "USER";
        session.user.authProvider = token.authProvider;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = token.picture ?? null;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

/** Alias storefront — route `/api/auth/[...nextauth]`. */
export const authOptions = storefrontAuthOptions;

export async function getStorefrontSession() {
  return getServerSession(storefrontAuthOptions);
}

export async function getAdminSession() {
  return getServerSession(adminAuthOptions);
}

export function isAdminRole(role: AppRole | string | undefined) {
  return role === "ADMIN" || role === "SUPERADMIN";
}

export function isSuperAdmin(role: AppRole | string | undefined) {
  return role === "SUPERADMIN";
}

export function isStorefrontRole(role: AppRole | string | undefined) {
  return role === "USER";
}

export function isGoogleAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
