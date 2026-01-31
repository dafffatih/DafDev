import { prisma } from "../lib/prisma"

async function main() {
    console.log("Starting database connection test...")

    try {
        console.log("Attempting to write to database...")
        const message = await prisma.message.create({
            data: {
                name: "Test User",
                email: "test@example.com",
                message: "This is a test message from the diagnostic script.",
            },
        })
        console.log("Successfully created message:", message)

        console.log("Attempting to read from database...")
        const count = await prisma.message.count()
        console.log(`Total messages in database: ${count}`)

        console.log("Database test passed!")
    } catch (error) {
        console.error("Database test FAILED:")
        console.error(error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
