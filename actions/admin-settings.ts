"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

export async function updateAdminProfile(formData: FormData) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Unauthorized" }
    }

    const userId = session.user.id
    const newUsername = formData.get("username") as string
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!newUsername || !currentPassword) {
        return { error: "Username and current password are required" }
    }

    if (newPassword && newPassword !== confirmPassword) {
        return { error: "New passwords do not match" }
    }

    try {
        // Verify current password using user ID
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user || !user.password) {
            return { error: "User not found" }
        }

        const isValid = await bcrypt.compare(currentPassword, user.password)

        if (!isValid) {
            return { error: "Incorrect current password" }
        }

        // Check if username is already taken by another user
        if (newUsername !== user.username) {
            const existingUser = await prisma.user.findUnique({
                where: { username: newUsername }
            })
            if (existingUser) {
                return { error: "Username is already taken" }
            }
        }

        // Prepare update data
        const updateData: any = {
            username: newUsername
        }

        if (newPassword) {
            updateData.password = await bcrypt.hash(newPassword, 10)
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        })

        revalidatePath("/admin/settings")
        return { success: "Profile updated successfully" }
    } catch (error) {
        console.error("Profile update error:", error)
        return { error: "Failed to update profile" }
    }
}

