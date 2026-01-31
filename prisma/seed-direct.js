const { createClient } = require("@libsql/client")
const bcrypt = require("bcryptjs")
require("dotenv").config()

async function main() {
    const url = process.env.DATABASE_URL || "file:dev.db"
    console.log("Connecting to:", url)

    const client = createClient({
        url: url
    })

    const username = "dafffatih_"
    const password = "Chacedievv3135*"
    const hashedPassword = await bcrypt.hash(password, 10)
    const id = "admin-user-id"
    const name = "Admin"

    try {
        // Check if user exists
        const rs = await client.execute({
            sql: "SELECT * FROM User WHERE username = ?",
            args: [username]
        })

        if (rs.rows.length > 0) {
            console.log("Admin user already exists. Updating password...")
            await client.execute({
                sql: "UPDATE User SET password = ? WHERE username = ?",
                args: [hashedPassword, username]
            })
        } else {
            console.log("Creating admin user...")
            await client.execute({
                sql: "INSERT INTO User (id, name, username, password) VALUES (?, ?, ?, ?)",
                args: [id, name, username, hashedPassword]
            })
        }

        console.log("Seeding completed successfully.")
    } catch (e) {
        console.error("Seeding error:", e)
    } finally {
        client.close()
    }
}

main()

