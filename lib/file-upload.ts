import { writeFile, unlink } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const filename = `${uuidv4()}${path.extname(file.name)}`

    // Ensure directory exists (basic check, assuming public/uploads exists or is created)
    // In a real app we might want to ensureDir, but for now we'll assume the structure
    // We will save to public/uploads/{folder}
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder)

    // Ensure the directory exists
    const fs = require('fs')
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)

    // Return the public path
    return `/uploads/${folder}/${filename}`
}

export async function deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl) return

    try {
        // Extract the relative path from the URL
        // URL is like /uploads/projects/filename.jpg
        const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl
        const filepath = path.join(process.cwd(), "public", relativePath)

        await unlink(filepath)
    } catch (error) {
        console.error(`Failed to delete file: ${fileUrl}`, error)
        // We generally don't want to throw here if the file is already gone
    }
}
