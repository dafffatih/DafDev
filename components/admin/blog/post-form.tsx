"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface PostFormProps {
    initialData?: any
    isEditing?: boolean
}

export function PostForm({ initialData, isEditing = false }: PostFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.coverImage || "")
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        published: initialData?.published ?? false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile))
        }
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, published: checked }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEditing
                ? `/api/posts/${initialData.id}`
                : "/api/posts"

            const method = isEditing ? "PATCH" : "POST"

            const data = new FormData()
            data.append("title", formData.title)
            data.append("excerpt", formData.excerpt)
            data.append("content", formData.content)
            data.append("published", String(formData.published))

            if (file) {
                data.append("coverImage", file)
            }

            const res = await fetch(url, {
                method,
                body: data,
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push("/admin/blog")
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/blog">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? "Edit Post" : "New Post"}
                </h1>
            </div>

            <div className="space-y-4 border p-6 rounded-lg bg-card">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="The Future of Web Development"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Short summary for preview cards..."
                        className="h-20"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image</Label>
                    <div className="flex flex-col gap-4">
                        {previewUrl && (
                            <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <Input
                            id="coverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">
                            Upload an image for the blog post cover.
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content (HTML)</Label>
                    <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        placeholder="# Hello World..."
                        className="min-h-[400px] font-mono text-sm"
                    />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="published"
                        checked={formData.published}
                        onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Post"}
            </Button>
        </form>
    )
}
