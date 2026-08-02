import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
      authProvider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    role?: Role;
    authProvider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    role?: Role;
    authProvider?: string;
  }
}
