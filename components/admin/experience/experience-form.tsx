"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, Plus, Trash2, GripVertical } from "lucide-react"
import Link from "next/link"

import { DatePicker } from "@/components/ui/date-picker"

interface ExperienceFormProps {
    initialData?: any
    isEditing?: boolean
}

// Helper to parse description - handles both old text format and new bullet format
function parseDescription(description: string): { text: string; bullets: string[] } {
    if (!description) return { text: "", bullets: [] }

    try {
        const parsed = JSON.parse(description)
        if (parsed.text !== undefined && parsed.bullets !== undefined) {
            return parsed
        }
    } catch {
        // Old format - plain text, try to extract bullets
        const lines = description.split('\n')
        const bullets: string[] = []
        const textLines: string[] = []

        lines.forEach(line => {
            const trimmed = line.trim()
            if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                bullets.push(trimmed.substring(2))
            } else if (trimmed) {
                textLines.push(trimmed)
            }
        })

        return { text: textLines.join('\n'), bullets }
    }

    return { text: description, bullets: [] }
}

export function ExperienceForm({ initialData, isEditing = false }: ExperienceFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Parse initial description
    const initialDesc = parseDescription(initialData?.description || "")

    const [formData, setFormData] = useState({
        position: initialData?.position || "",
        company: initialData?.company || "",
        startDate: initialData?.startDate || "",
        endDate: initialData?.endDate || "",
        current: !initialData?.endDate && isEditing ? true : false,
        descriptionText: initialDesc.text,
        bullets: initialDesc.bullets.length > 0 ? initialDesc.bullets : [""],
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (field: "startDate" | "endDate", date: Date | undefined) => {
        setFormData((prev) => ({
            ...prev,
            [field]: date ? date.toISOString() : ""
        }))
    }

    const handleCurrentChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            current: checked,
            endDate: checked ? "" : prev.endDate
        }))
    }

    // Bullet point handlers
    const handleBulletChange = (index: number, value: string) => {
        setFormData((prev) => {
            const newBullets = [...prev.bullets]
            newBullets[index] = value
            return { ...prev, bullets: newBullets }
        })
    }

    const addBullet = () => {
        setFormData((prev) => ({
            ...prev,
            bullets: [...prev.bullets, ""]
        }))
    }

    const removeBullet = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            bullets: prev.bullets.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isEditing
                ? `/api/experience/${initialData.id}`
                : "/api/experience"

            const method = isEditing ? "PATCH" : "POST"

            // Combine text and bullets into JSON description
            const description = JSON.stringify({
                text: formData.descriptionText,
                bullets: formData.bullets.filter(b => b.trim() !== "")
            })

            const payload = {
                position: formData.position,
                company: formData.company,
                description,
                endDate: formData.current ? null : formData.endDate ? new Date(formData.endDate) : null,
                startDate: new Date(formData.startDate)
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Failed to save")

            router.push("/admin/experience")
            router.refresh()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/experience">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? "Edit Experience" : "Add Experience"}
                </h1>
            </div>

            <div className="space-y-4 border p-6 rounded-lg bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                            placeholder="Senior Developer"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            placeholder="Acme Corp"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <DatePicker
                            date={formData.startDate ? new Date(formData.startDate) : undefined}
                            setDate={(date) => handleDateChange("startDate", date)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className={formData.current ? "opacity-50" : ""}>End Date</Label>
                        <DatePicker
                            date={formData.endDate ? new Date(formData.endDate) : undefined}
                            setDate={(date) => handleDateChange("endDate", date)}
                            disabled={formData.current}
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="current"
                        checked={formData.current}
                        onCheckedChange={handleCurrentChange}
                    />
                    <Label htmlFor="current">I currently work here</Label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="descriptionText">Description (Summary)</Label>
                    <Textarea
                        id="descriptionText"
                        name="descriptionText"
                        value={formData.descriptionText}
                        onChange={handleChange}
                        placeholder="Brief overview of your role..."
                        className="min-h-[80px]"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Key Achievements / Responsibilities (Bullet Points)</Label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addBullet}
                            className="gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add Point
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {formData.bullets.map((bullet, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                                <span className="text-muted-foreground">•</span>
                                <Input
                                    value={bullet}
                                    onChange={(e) => handleBulletChange(index, e.target.value)}
                                    placeholder={`Achievement or responsibility ${index + 1}...`}
                                    className="flex-1"
                                />
                                {formData.bullets.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeBullet(index)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Add bullet points to highlight key achievements or responsibilities.
                    </p>
                </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                {loading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Save Experience"}
            </Button>
        </form>
    )
}

