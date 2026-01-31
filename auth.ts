
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    // FALLBACK SECRET FOR DEV ONLY - In production, strictly use environment variable
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "development-fallback-secret-key-change-in-prod",
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username as string }
                })

                if (!user || !user.password) {
                    return null
                }

                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isValid) {
                    return null
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image
                }
            },
        }),
    ],
})
