// lib/auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        mode: { label: "Mode", type: "text" }, // "signin" | "signup"
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        // In production: hash passwords with bcrypt.
        // For MVP we store email and create user on first sign-in.
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user && credentials.mode === "signup") {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name ?? credentials.email.split("@")[0],
              provider: "email",
            },
          });
        }
        return user ?? null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/",   // we handle auth via modal, not a dedicated page
    error: "/",
  },
};

export default NextAuth(authOptions);
