import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // Try DB first if live cloud database is configured
        try {
          const dbUrl = process.env.DATABASE_URL || "";
          if (dbUrl.length > 0 && !dbUrl.includes("placeholder") && !dbUrl.includes("localhost:5432")) {
            const user = await prisma.user.findUnique({
              where: { email },
            });

            if (user && user.password && user.isActive) {
              const isValid = await bcrypt.compare(password, user.password);
              if (isValid) {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  image: user.image,
                };
              }
            }
          }
        } catch (dbError) {
          console.warn("DB user check failed, falling back to static accounts:", dbError);
        }

        // Standard Seed Accounts (Available in memory and offline)
        if (email === "admin@clickcart.com" && password === "Admin@123") {
          return {
            id: "user-admin-seed",
            name: "ClickCart Administrator",
            email: "admin@clickcart.com",
            role: "ADMIN",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
          };
        }

        if (email === "customer@clickcart.com" && password === "Customer@123") {
          return {
            id: "user-customer-seed",
            name: "Demo Customer",
            email: "customer@clickcart.com",
            role: "CUSTOMER",
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
          };
        }

        throw new Error("Invalid email or password.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || "CUSTOMER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "clickcart_secret_key_123456789",
};
