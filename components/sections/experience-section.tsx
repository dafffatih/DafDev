import { prisma } from "@/lib/prisma"
import { ExperienceClient } from "./experience-client"

export async function ExperienceSection() {
    const experiences = await prisma.experience.findMany({
        orderBy: { startDate: "desc" },
    })

    return <ExperienceClient experiences={experiences} />
}
