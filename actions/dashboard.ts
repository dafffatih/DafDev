"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
    const session = await auth()

    if (!session) {
        return null
    }

    try {
        const [projectsCount, experienceCount, skillsCount, postsCount] = await Promise.all([
            prisma.project.count(),
            prisma.experience.count(),
            prisma.skill.count(),
            prisma.post.count(),
        ])

        return {
            projects: projectsCount,
            experience: experienceCount,
            skills: skillsCount,
            posts: postsCount,
        }
    } catch (error) {
        console.error("Dashboard stats error:", error)
        return {
            projects: 0,
            experience: 0,
            skills: 0,
            posts: 0,
        }
    }
}
