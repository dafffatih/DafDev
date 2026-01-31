
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil } from "lucide-react"
import { deleteProject } from "@/app/actions/admin"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <Link href="/admin/projects/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> New Project
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                        {/* Simple cover image placeholder if none */}
                        <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground">
                            {project.imageUrl ? (
                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                            ) : (
                                <span>No Image</span>
                            )}
                        </div>

                        <CardHeader className="p-4">
                            <CardTitle className="flex items-center justify-between text-lg">
                                <span className="truncate">{project.title}</span>
                                {project.published ? (
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">Published</span>
                                ) : (
                                    <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">Draft</span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                {project.description}
                            </p>

                            <div className="flex items-center gap-2">
                                <Link href={`/admin/projects/${project.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full gap-2">
                                        <Pencil className="w-3 h-3" /> Edit
                                    </Button>
                                </Link>
                                <DeleteButton
                                    id={project.id}
                                    action={deleteProject}
                                    title={project.title}
                                    variant="destructive"
                                    size="sm"
                                    className="w-9 px-0"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No projects found. Create your first one.
                    </div>
                )}
            </div>
        </div>
    )
}
