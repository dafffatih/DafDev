
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(projects)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }
}

import { saveFile } from "@/lib/file-upload"

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const techStack = formData.get("techStack") as string
        const repoUrl = formData.get("repoUrl") as string
        const liveUrl = formData.get("liveUrl") as string
        const published = formData.get("published") === "true"

        const imageFile = formData.get("image") as File | null
        const demoFile = formData.get("demo") as File | null

        let imageUrl = ""
        let demoUrl = ""

        if (imageFile && imageFile.size > 0) {
            imageUrl = await saveFile(imageFile, "projects")
        }

        if (demoFile && demoFile.size > 0) {
            demoUrl = await saveFile(demoFile, "projects")
        }

        const project = await prisma.project.create({
            data: {
                title,
                description,
                techStack,
                repoUrl,
                liveUrl,
                published,
                imageUrl,
                demoUrl,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("Project Create Error:", error)
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
}
