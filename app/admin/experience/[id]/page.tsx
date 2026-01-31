import { ExperienceForm } from "@/components/admin/experience/experience-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditExperiencePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const experience = await prisma.experience.findUnique({
        where: { id: params.id },
    })

    if (!experience) {
        notFound()
    }

    return <ExperienceForm initialData={experience} isEditing />
}
