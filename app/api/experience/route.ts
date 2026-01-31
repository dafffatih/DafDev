
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const experiences = await prisma.experience.findMany({
            orderBy: { startDate: "desc" },
        })
        return NextResponse.json(experiences)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const json = await req.json()
        // Ensure dates are ISODate strings or Date objects
        if (json.startDate) json.startDate = new Date(json.startDate)
        if (json.endDate) json.endDate = new Date(json.endDate)

        const experience = await prisma.experience.create({
            data: json,
        })

        return NextResponse.json(experience)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
    }
}
