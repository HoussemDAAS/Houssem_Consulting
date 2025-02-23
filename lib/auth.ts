import NextAuth, { type AuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/lib/models/User";

export const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
  // In the CredentialsProvider:
async authorize(credentials) {
  try {
    await clientPromise;
    const user = await User.findOne({ email: credentials?.email });
    if (!user) return null;
    
    // Direct password comparison
    if (credentials?.password !== user.password) return null;
    
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
  } catch (error) {
    console.error("Authorization error:", error);
    return null;
  }
}
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  }
};

export const auth = () => NextAuth(authOptions);