import { ProjectForm } from "@/components/admin/projects/project-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const project = await prisma.project.findUnique({
        where: { id: params.id },
    })

    if (!project) {
        notFound()
    }

    return <ProjectForm initialData={project} isEditing />
}
