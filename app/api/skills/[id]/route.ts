
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const skill = await prisma.skill.findUnique({
            where: { id: params.id },
        })
        if (!skill) {
            return NextResponse.json({ error: "Skill not found" }, { status: 404 })
        }
        return NextResponse.json(skill)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 })
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
        const skill = await prisma.skill.update({
            where: { id: params.id },
            data: json,
        })

        return NextResponse.json(skill)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.skill.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: "Skill deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
    }
}
