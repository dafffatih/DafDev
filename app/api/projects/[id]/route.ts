
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.id },
        })
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }
        return NextResponse.json(project)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
    }
}

import { saveFile, deleteFile } from "@/lib/file-upload"

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()

        // Fetch existing project to get old file paths
        const existingProject = await prisma.project.findUnique({
            where: { id: params.id }
        })

        if (!existingProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const techStack = formData.get("techStack") as string
        const repoUrl = formData.get("repoUrl") as string
        const liveUrl = formData.get("liveUrl") as string
        const published = formData.get("published") === "true"

        const imageFile = formData.get("image") as File | null
        const demoFile = formData.get("demo") as File | null

        let imageUrl = existingProject.imageUrl
        let demoUrl = existingProject.demoUrl

        // Handle Image Update
        if (imageFile && imageFile.size > 0) {
            // Delete old image if exists
            if (existingProject.imageUrl) {
                await deleteFile(existingProject.imageUrl)
            }
            imageUrl = await saveFile(imageFile, "projects")
        }

        // Handle Demo Video Update
        if (demoFile && demoFile.size > 0) {
            // Delete old video if exists
            if (existingProject.demoUrl) {
                await deleteFile(existingProject.demoUrl)
            }
            demoUrl = await saveFile(demoFile, "projects")
        }

        const project = await prisma.project.update({
            where: { id: params.id },
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
        console.error("Project Update Error:", error)
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get project to delete files
        const project = await prisma.project.findUnique({
            where: { id: params.id }
        })

        if (project) {
            if (project.imageUrl) await deleteFile(project.imageUrl)
            if (project.demoUrl) await deleteFile(project.demoUrl)
        }

        await prisma.project.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "Project deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }
}
