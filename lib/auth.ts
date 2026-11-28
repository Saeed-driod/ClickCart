import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const AUTH_SECRET =
  process.env.NEXTAUTH_SECRET || "clickcart_secret_key_123456789";

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

        // Optional ADMIN_PASSWORD override via environment variable
        if (
          email === "admin@clickcart.com" &&
          process.env.ADMIN_PASSWORD &&
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

        // Check live MongoDB user record first
        let dbCheckedUser = false;
        try {
          const dbUrl = process.env.DATABASE_URL || "";
          if (
            dbUrl.length > 0 &&
            !dbUrl.includes("placeholder") &&
            !dbUrl.includes("localhost:5432")
          ) {
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
          console.warn("DB user check failed, falling back to seed accounts:", dbError);
        }

        // Offline / unseeded fallback accounts
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
