
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, Calendar, Globe, ImageOff } from "lucide-react"
import { format } from "date-fns"

interface VideoPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function VideoPage({ params }: VideoPageProps) {
    const { id } = await params

    const project = await prisma.project.findUnique({
        where: {
            id: id,
        },
    })

    if (!project) {
        notFound()
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div className="w-full max-w-6xl mx-auto space-y-8">
                {/* Back Button */}
                <div className="w-full">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Media Container */}
                <div className="w-full bg-black/5 rounded-xl border border-muted/30 overflow-hidden shadow-2xl relative aspect-video group">
                    {project.demoUrl ? (
                        <video
                            src={project.demoUrl}
                            className="w-full h-full object-contain bg-black"
                            controls
                            autoPlay
                            playsInline
                        >
                            Your browser does not support the video tag.
                        </video>
                    ) : project.imageUrl ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 text-muted-foreground gap-3">
                            <ImageOff className="w-16 h-16 opacity-50" />
                            <span className="font-medium text-lg">Image Not Found</span>
                        </div>
                    )}
                </div>

                {/* Project Details */}
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            {project.title}
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-4">
                            {project.techStack.split(",").map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium"
                                >
                                    {tech.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-6 p-6 bg-muted/30 rounded-lg border border-muted/50 h-fit">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Project Details</h3>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>Published on {format(new Date(project.createdAt), "MMMM d, yyyy")}</span>
                            </div>

                            {project.liveUrl && (
                                <Link href={project.liveUrl} target="_blank" className="block">
                                    <Button variant="outline" className="w-full gap-2">
                                        <Globe className="w-4 h-4" /> Visit Website
                                    </Button>
                                </Link>
                            )}

                            <Link href={project.repoUrl || "https://github.com/dafffatih"} target="_blank" className="block">
                                <Button variant="outline" className="w-full gap-2">
                                    <Github className="w-4 h-4" /> View on GitHub
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
