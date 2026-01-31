
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const json = await req.json()
        const { name, email, message } = json

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Save to database
        await prisma.message.create({
            data: {
                name,
                email,
                message,
            },
        })

        return NextResponse.json({ message: "Message sent successfully" })
    } catch (error) {
        console.error("CONTACT_API_ERROR:", error)
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }
}
