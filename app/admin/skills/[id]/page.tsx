import { SkillForm } from "@/components/admin/skills/skill-form"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditSkillPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const skill = await prisma.skill.findUnique({
        where: { id: params.id },
    })

    if (!skill) {
        notFound()
    }

    return <SkillForm initialData={skill} isEditing />
}
