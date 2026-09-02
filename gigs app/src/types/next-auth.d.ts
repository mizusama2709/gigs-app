import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "freelancer" | "client";
    } & DefaultSession["user"];
  }

  interface User {
    role: "freelancer" | "client";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "freelancer" | "client";
  }
}
