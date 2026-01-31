"use server"

import { signOut } from "@/auth"

export async function logout() {
    await signOut({ redirect: false })
    // Return signIn page path - caller handles redirect
    return { redirectTo: "/login" }
}

