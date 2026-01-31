
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"

// Simple slug generator
const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        })
        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
    }
}

import { saveFile } from "@/lib/file-upload"

// ... imports remain the same ...

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const title = formData.get("title") as string
        const content = formData.get("content") as string
        const excerpt = formData.get("excerpt") as string
        const published = formData.get("published") === "true"
        const imageFile = formData.get("coverImage") as File | null

        // Auto-generate slug if not provided or just use title
        const slug = generateSlug(title) + "-" + Date.now()

        let coverImage = ""

        if (imageFile && imageFile.size > 0) {
            coverImage = await saveFile(imageFile, "posts")
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                coverImage,
                published
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error("Post Create Error:", error)
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }
}
