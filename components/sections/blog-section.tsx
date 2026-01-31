import { prisma } from "@/lib/prisma"
import { BlogClient } from "./blog-client"

export async function BlogSection() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    })

    return <BlogClient posts={posts} />
}
