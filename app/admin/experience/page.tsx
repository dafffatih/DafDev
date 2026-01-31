
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Calendar } from "lucide-react"
import { deleteExperience } from "@/app/actions/admin"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminExperiencePage() {
    const experiences = await prisma.experience.findMany({
        orderBy: { startDate: "desc" },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
                <Link href="/admin/experience/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> Add Experience
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <Card key={exp.id}>
                        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-bold text-lg">{exp.position}</h3>
                                <p className="text-muted-foreground">{exp.company}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(exp.startDate).getFullYear()} -
                                        {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <Link href={`/admin/experience/${exp.id}`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Pencil className="w-4 h-4" /> Edit
                                    </Button>
                                </Link>
                                <DeleteButton
                                    id={exp.id}
                                    action={deleteExperience}
                                    title={`${exp.position} at ${exp.company}`}
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {experiences.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No experience entries yet.
                    </div>
                )}
            </div>
        </div>
    )
}
