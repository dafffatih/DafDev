"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Globe } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"

type Project = {
    id: string
    title: string
    description: string
    imageUrl: string | null
    demoUrl: string | null
    repoUrl: string | null
    liveUrl: string | null
    techStack: string
    published: boolean
    createdAt: Date
    updatedAt: Date
}

interface ProjectsClientProps {
    projects: Project[]
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
    const { t } = useLanguage()
    const [hoveredProject, setHoveredProject] = useState<string | null>(null)

    return (
        <section id="projects" className="min-h-screen flex flex-col justify-center py-24 px-4 container mx-auto">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-normal bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 text-shadow-sm">
                        {t.projects.title}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-shadow-sm">
                        {t.projects.subtitle}
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    {projects.map((project, index) => {
                        const isHovered = hoveredProject === project.id

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                viewport={{ once: false }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative"
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                {/* Glow effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                                <Card
                                    className="relative h-full flex flex-col bg-card border-muted/50 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                                >
                                    <div className="aspect-video w-full bg-muted overflow-hidden relative">
                                        {/* Video / Image Logic */}
                                        {isHovered && project.demoUrl ? (
                                            <video
                                                src={project.demoUrl}
                                                className="w-full h-full object-cover object-top block"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : project.imageUrl ? (
                                            <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover object-top block transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-700">
                                                <span className="font-mono text-xs">{t.projects.noPreview}</span>
                                            </div>
                                        )}


                                        {/* Website & GitHub Links */}
                                        <div className="absolute top-2 right-2 z-20 flex gap-2">
                                            {project.liveUrl && (
                                                <Link
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="block p-1.5 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white rounded-full transition-all duration-300"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                </Link>
                                            )}

                                            <Link
                                                href={project.repoUrl || "https://github.com/dafffatih"}
                                                target="_blank"
                                                onClick={(e) => e.stopPropagation()}
                                                className="block p-1.5 bg-black/50 hover:bg-black/70 text-white/70 hover:text-white rounded-full transition-all duration-300"
                                            >
                                                <Github className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Main Card Link - Stretched */}
                                    <Link href={`/video/${project.id}`} className="absolute inset-0 z-0" />

                                    <CardHeader>
                                        <CardTitle className="text-xl">{project.title}</CardTitle>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {project.techStack.split(",").map((tech) => (
                                                <span key={tech} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                    {tech.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex-grow">
                                        <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                            {project.description}
                                        </p>
                                    </CardContent>


                                </Card>
                            </motion.div>
                        )
                    })}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>{t.projects.noProjects}</p>
                    </div>
                )}
            </div>
        </section>
    )
}
