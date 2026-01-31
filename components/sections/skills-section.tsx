import { prisma } from "@/lib/prisma"
import { SkillsClient } from "./skills-client"

export async function SkillsSection() {
  const skills = await prisma.skill.findMany({
    orderBy: { order: "asc" },
  })

  // 🔧 Normalisasi data agar sesuai dengan tipe Skill di client
  const normalizedSkills = skills.map(skill => ({
    ...skill,
    proficiency: skill.proficiency ?? 0,
  }))

  return <SkillsClient skills={normalizedSkills} />
}
