"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteProject(id: string) {
    try {
        await prisma.project.delete({
            where: { id },
        })
        revalidatePath("/admin/projects")
        revalidatePath("/") // Revalidate home page as well
        return { success: true }
    } catch (error) {
        console.error("Failed to delete project:", error)
        return { success: false, error: "Failed to delete project" }
    }
}

export async function deleteExperience(id: string) {
    try {
        await prisma.experience.delete({
            where: { id },
        })
        revalidatePath("/admin/experience")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete experience:", error)
        return { success: false, error: "Failed to delete experience" }
    }
}

export async function deleteSkill(id: string) {
    try {
        await prisma.skill.delete({
            where: { id },
        })
        revalidatePath("/admin/skills")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete skill:", error)
        return { success: false, error: "Failed to delete skill" }
    }
}

export async function deletePost(id: string) {
    try {
        await prisma.post.delete({
            where: { id },
        })
        revalidatePath("/admin/blog")
        revalidatePath("/")
        revalidatePath("/blog")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete post:", error)
        return { success: false, error: "Failed to delete post" }
    }
}

export async function deleteMessage(id: string) {
    try {
        await prisma.message.delete({
            where: { id },
        })
        revalidatePath("/admin/messages")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete message:", error)
        return { success: false, error: "Failed to delete message" }
    }
}

export async function updateSkillsOrder(items: { id: string; order: number }[]) {
    try {
        await Promise.all(
            items.map((item) =>
                prisma.skill.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        )
        revalidatePath("/admin/skills")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Failed to update skills order:", error)
        return { success: false, error: "Failed to update skills order" }
    }
}
