"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"

// Define the type for the skills prop
type Skill = {
    id: string
    name: string
    category: string
    icon: string | null
    proficiency: number
}

interface SkillsClientProps {
    skills: Skill[]
}

export function SkillsClient({ skills }: SkillsClientProps) {
    const { t } = useLanguage()

    // Group skills
    const groupedSkills = skills.reduce((acc, skill) => {
        (acc[skill.category] = acc[skill.category] || []).push(skill)
        return acc
    }, {} as Record<string, Skill[]>)

    return (
        <section id="skills" className="min-h-screen flex flex-col justify-center py-24 px-4 container mx-auto">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 text-shadow-sm">
                        {t.skills.title}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-shadow-sm">
                        {t.skills.subtitle}
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    {Object.entries(groupedSkills).map(([category, items], idx) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="space-y-4"
                        >
                            <div className="relative group">
                                {/* Decorative blur */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg transition duration-500 group-hover:duration-200" />

                                <Card className="relative bg-card/50 backdrop-blur-sm border-white/10 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold text-primary tracking-wide uppercase text-sm">
                                            {category}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {items.map((skill) => (
                                            <div key={skill.id} className="space-y-2">
                                                <div className="flex justify-between text-sm items-center">
                                                    <div className="flex items-center gap-2">
                                                        {skill.icon && (
                                                            <img
                                                                src={skill.icon}
                                                                alt={skill.name}
                                                                className="w-6 h-6 object-contain"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none'
                                                                }}
                                                            />
                                                        )}
                                                        <span className="font-medium">{skill.name}</span>
                                                    </div>
                                                    <span className="text-muted-foreground">{skill.proficiency}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${skill.proficiency}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        viewport={{ once: true }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {skills.length === 0 && (
                    <motion.div
                        className="flex flex-col items-center justify-center py-20 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center"
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <svg className="w-12 h-12 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </motion.div>
                        <p className="text-lg text-muted-foreground mb-2">{t.skills.noSkills}</p>
                        <p className="text-sm text-muted-foreground/60">Skills will appear here once added</p>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
