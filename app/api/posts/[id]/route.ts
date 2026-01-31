
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const post = await prisma.post.findUnique({
            where: { id: params.id },
        })
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
    }
}

import { saveFile, deleteFile } from "@/lib/file-upload"

// ... imports ...

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
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

        const existingPost = await prisma.post.findUnique({
            where: { id: params.id },
        })

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        let coverImage = existingPost.coverImage

        if (imageFile && imageFile.size > 0) {
            // Delete old file if exists
            if (coverImage) {
                await deleteFile(coverImage)
            }
            // Save new file
            coverImage = await saveFile(imageFile, "posts")
        }

        const post = await prisma.post.update({
            where: { id: params.id },
            data: {
                title,
                content,
                excerpt,
                published,
                coverImage
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error("Post Update Error:", error)
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const post = await prisma.post.findUnique({
            where: { id: params.id },
        })

        if (post && post.coverImage) {
            await deleteFile(post.coverImage)
        }

        await prisma.post.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "Post deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
    }
}
