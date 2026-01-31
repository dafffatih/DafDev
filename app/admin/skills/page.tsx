import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SkillsAdminClient } from "./skills-admin-client"

export default async function AdminSkillsPage() {
    const skills = await prisma.skill.findMany({
        orderBy: { order: "asc" },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
                <Link href="/admin/skills/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Add Skill
                    </Button>
                </Link>
            </div>

            <SkillsAdminClient initialSkills={skills} />
        </div>
    )
}
