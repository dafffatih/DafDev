"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

interface SkillFormProps {
    initialData?: any
    isEditing?: boolean
}

export function SkillForm({ initialData, isEditing = false }: SkillFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        category: initialData?.category || "",
        icon: initialData?.icon || "",
        proficiency: initialData?.proficiency || 50,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'proficiency' ? parseInt(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEditing
                ? `/api/skills/${initialData.id}`
                : "/api/skills"

            const method = isEditing ? "PATCH" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push("/admin/skills")
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/skills">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? "Edit Skill" : "New Skill"}
                </h1>
            </div>

            <div className="space-y-4 border p-6 rounded-lg bg-card">
                <div className="space-y-2">
                    <Label htmlFor="name">Skill Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="React"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        placeholder="Frontend / Backend / Tools"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="proficiency">Proficiency ({formData.proficiency}%)</Label>
                    <input
                        type="range"
                        id="proficiency"
                        name="proficiency"
                        min="0"
                        max="100"
                        value={formData.proficiency}
                        onChange={handleChange}
                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="icon">Icon Name (Lucide) or URL</Label>
                    <Input
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        placeholder="Code / Database / https://..."
                    />
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Add Skill"}
            </Button>
        </form>
    )
}
