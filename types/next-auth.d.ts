import type { AppRole } from "@/lib/auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: AppRole;
      authProvider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username?: string;
    role?: AppRole;
    authProvider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    role?: AppRole;
    authProvider?: string;
  }
}
