import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const username = credentials?.username?.trim();
      const password = credentials?.password;
      if (!username || !password) return null;

      const user = await prisma.user.findFirst({
        where: { OR: [{ username }, { email: username }] },
      });
      if (!user || !(await bcrypt.compare(password, user.password))) return null;

      return {
        id: user.id,
        name: user.name ?? user.username ?? user.email,
        email: user.email,
        image: user.avatar ?? undefined,
        username: user.username ?? undefined,
        role: user.role,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers,
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
          role: "BUYER",
        },
        update: {
          name: user.name ?? undefined,
          avatar: user.image ?? undefined,
        },
      });
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const u = user as {
          id: string;
          username?: string;
          role?: Role;
        };
        token.sub = u.id;
        token.username = u.username;
        token.role = u.role;
      }
      if (account?.provider === "google" && token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (dbUser) {
          token.sub = dbUser.id;
          token.username = dbUser.username ?? undefined;
          token.role = dbUser.role;
          token.picture = dbUser.avatar ?? token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.username = (token.username as string) ?? "";
        session.user.role = (token.role as Role) ?? "BUYER";
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export function isAdminRole(role: Role | string | undefined) {
  return role === "ADMIN" || role === "SUPERADMIN";
}

export function isSuperAdmin(role: Role | string | undefined) {
  return role === "SUPERADMIN";
}
