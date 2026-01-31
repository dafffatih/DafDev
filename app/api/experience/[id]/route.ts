
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const experience = await prisma.experience.findUnique({
            where: { id: params.id },
        })
        if (!experience) {
            return NextResponse.json({ error: "Experience not found" }, { status: 404 })
        }
        return NextResponse.json(experience)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 })
    }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const json = await req.json()
        if (json.startDate) json.startDate = new Date(json.startDate)
        if (json.endDate) json.endDate = new Date(json.endDate)
        // Handle "Present" case where endDate might be null intentionally, ensure frontend sends null if cleared

        const experience = await prisma.experience.update({
            where: { id: params.id },
            data: json,
        })

        return NextResponse.json(experience)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.experience.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "Experience deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
    }
}
