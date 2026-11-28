import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { isDatabaseActive } from "./db";

function getRequiredAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXTAUTH_SECRET environment variable must be set in production.");
    }
    throw new Error("NEXTAUTH_SECRET environment variable is required.");
  }
  return secret;
}

export const AUTH_SECRET = getRequiredAuthSecret();

export const ADMIN_SESSION_VERSION = "v2";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
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

        // Admin login via ADMIN_PASSWORD environment variable
        if (
          email === "admin@clickcart.com" &&
          process.env.ADMIN_PASSWORD &&
          process.env.ADMIN_PASSWORD.length > 0 &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "user-admin-env",
            name: "ClickCart Administrator",
            email: "admin@clickcart.com",
            role: "ADMIN",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
          };
        }

        // Check live database user record
        let dbCheckedUser = false;
        try {
          if (isDatabaseActive()) {
            const user = await prisma.user.findUnique({
              where: { email },
            });

            if (user) {
              dbCheckedUser = true;
              if (user.password && user.isActive) {
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
              throw new Error("Invalid email or password.");
            }
          }
        } catch (dbError: any) {
          if (dbCheckedUser) {
            throw dbError;
          }
          console.warn("DB user check failed:", dbError);
        }

        // Demo customer account (offline / non-admin convenience only)
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
        token.sessionVersion = ADMIN_SESSION_VERSION;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token.role as string) || "CUSTOMER";
        (session.user as any).sessionVersion = token.sessionVersion as string;
      }
      return session;
    },
  },
  secret: AUTH_SECRET,
};

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  if (!session || user?.role !== "ADMIN" || user?.sessionVersion !== ADMIN_SESSION_VERSION) {
    return null;
  }
  return session;
}
