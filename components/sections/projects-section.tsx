import { prisma } from "@/lib/prisma"
import { ProjectsClient } from "./projects-client"

export async function ProjectsSection() {
    // Fetch published projects
    const projects = await prisma.project.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    })

    return <ProjectsClient projects={projects} />
}
