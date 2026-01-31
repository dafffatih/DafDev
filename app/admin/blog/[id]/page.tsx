import { PostForm } from "@/components/admin/blog/post-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditPostPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    })

    if (!post) {
        notFound()
    }

    return <PostForm initialData={post} isEditing />
}
