"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, UploadCloud } from "lucide-react"
import Link from "next/link"

interface ProjectFormProps {
    initialData?: any
    isEditing?: boolean
}

export function ProjectForm({ initialData, isEditing = false }: ProjectFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // State for text fields
    const [title, setTitle] = useState(initialData?.title || "")
    const [description, setDescription] = useState(initialData?.description || "")
    const [techStack, setTechStack] = useState(initialData?.techStack || "")
    const [repoUrl, setRepoUrl] = useState(initialData?.repoUrl || "")
    const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "")
    const [published, setPublished] = useState(initialData?.published ?? true)

    // State for files
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [demoFile, setDemoFile] = useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEditing
                ? `/api/projects/${initialData.id}`
                : "/api/projects"

            const method = isEditing ? "PATCH" : "POST"

            const formData = new FormData()
            formData.append("title", title)
            formData.append("description", description)
            formData.append("techStack", techStack)
            formData.append("repoUrl", repoUrl)
            formData.append("liveUrl", liveUrl)
            formData.append("published", String(published))

            if (imageFile) {
                formData.append("image", imageFile)
            }
            if (demoFile) {
                formData.append("demo", demoFile)
            }

            const res = await fetch(url, {
                method,
                body: formData,
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push("/admin/projects")
            router.refresh()
        } catch (error) {
            console.error(error)
            // Show toast error here
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/projects">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? "Edit Project" : "New Project"}
                </h1>
            </div>

            <div className="space-y-4 border p-6 rounded-lg bg-card">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Project Name"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        placeholder="Short description of the project..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="techStack">Tech Stack</Label>
                    <Input
                        id="techStack"
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        placeholder="React, Next.js, Three.js (comma separated)"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="liveUrl">Website URL</Label>
                        <Input
                            id="liveUrl"
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            placeholder="https://example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="repoUrl">Repository URL</Label>
                        <Input
                            id="repoUrl"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/..."
                        />
                    </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="image">Project Image</Label>
                        <div className="flex flex-col gap-2">
                            {isEditing && initialData?.imageUrl && (
                                <div className="text-xs text-muted-foreground truncate">
                                    Current: {initialData.imageUrl}
                                </div>
                            )}
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="demo">Demo Video</Label>
                        <div className="flex flex-col gap-2">
                            {isEditing && initialData?.demoUrl && (
                                <div className="text-xs text-muted-foreground truncate">
                                    Current: {initialData.demoUrl}
                                </div>
                            )}
                            <Input
                                id="demo"
                                type="file"
                                accept="video/*,.mkv"
                                onChange={(e) => setDemoFile(e.target.files?.[0] || null)}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="published"
                        checked={published}
                        onCheckedChange={(c) => setPublished(c === true)}
                    />
                    <Label htmlFor="published">Published</Label>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Project"}
            </Button>
        </form>
    )
}
