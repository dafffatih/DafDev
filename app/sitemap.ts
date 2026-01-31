
import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || "https://example.com"

    // Static routes
    const routes = [
        "",
        "/projects",
        "/skills",
        "/experience",
        "/blog",
        "/contact",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }))

    // Dynamic routes (Projects)
    const projects = await prisma.project.findMany({
        where: { published: true },
        select: { id: true, updatedAt: true }
    })

    // Dynamic routes (Blog Posts)
    const posts = await prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true }
    })

    const projectRoutes = projects.map((project) => ({
        url: `${baseUrl}/projects`, // We don't have individual project pages yet, just the list
        lastModified: project.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }))

    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.7,
    }))

    return [...routes, ...postRoutes]
}
