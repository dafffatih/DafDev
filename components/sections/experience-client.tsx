"use client"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/providers/language-provider"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

type Experience = {
    id: string
    position: string
    company: string
    startDate: Date
    endDate: Date | null
    description: string
}

interface ExperienceClientProps {
    experiences: Experience[]
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
        // Old format - plain text
        return { text: description, bullets: [] }
    }

    return { text: description, bullets: [] }
}

export function ExperienceClient({ experiences }: ExperienceClientProps) {
    const { t } = useLanguage()
    const experiencesContainerRef = useRef(null)
    const isInView = useInView(experiencesContainerRef, { once: false, amount: "some" })

    return (
        <section id="experience" className="min-h-screen flex flex-col justify-center py-24 px-4 container mx-auto">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-normal bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 text-shadow-sm">
                        {t.experience.title}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-shadow-sm">
                        {t.experience.subtitle}
                    </p>
                </motion.div>

                <div className="w-full relative">
                    {/* Vertical line - animated gradient glow, hidden when no experiences */}
                    {experiences.length > 0 && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: isInView ? "calc(100% - 15.5rem)" : 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute left-0 md:left-1/2 -translate-x-1/2 hidden md:block origin-top"
                            style={{
                                width: '40px',
                                top: '0.375rem', // Align with first dot center
                            }}
                        >
                            {/* Gradient glow background - full height */}
                            <div
                                className="absolute inset-0 left-1/2 -translate-x-1/2"
                                style={{
                                    width: '20px',
                                    background: 'linear-gradient(180deg, #3b82f6 0%, #6366f1 15%, #a855f7 30%, #ec4899 45%, #f43f5e 55%, #f97316 70%, #eab308 85%, #facc15 100%)',
                                    filter: 'blur(12px)',
                                    opacity: 0.5,
                                    animation: 'glow-pulse 4s ease-in-out infinite',
                                }}
                            />

                            {/* Base white thin line on top */}
                            <div className="absolute inset-0 w-px bg-white/80 left-1/2 -translate-x-1/2 rounded-full" />
                        </motion.div>
                    )}

                    <div ref={experiencesContainerRef} className="space-y-12">
                        {experiences.map((exp, index) => {
                            const isEven = index % 2 === 0
                            const desc = parseDescription(exp.description)

                            return (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, x: isEven ? -50 : 50, filter: "blur(8px)" }}
                                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    viewport={{ once: false, margin: "-50px" }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={cn(
                                        "relative flex flex-col md:flex-row gap-8 md:gap-0",
                                        isEven ? "md:flex-row-reverse" : ""
                                    )}
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background -translate-x-[5px] md:-translate-x-1/2 mt-1.5 z-10 shadow-[0_0_10px_theme(colors.primary.DEFAULT)]" />

                                    {/* Date (Desktop only) */}
                                    <div className={cn(
                                        "hidden md:block w-1/2 pt-1",
                                        isEven ? "pl-8 text-left" : "pr-8 text-right"
                                    )}>
                                        <span className="text-sm font-bold text-primary tracking-widest uppercase">
                                            {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className={cn(
                                        "w-full md:w-1/2 pl-8 md:pl-0 border-l border-border md:border-l-0",
                                        isEven ? "md:pr-12" : "md:pl-12"
                                    )}>
                                        <div className="space-y-2 md:hidden mb-2">
                                            <span className="text-xs font-bold text-primary tracking-widest uppercase bg-primary/10 px-2 py-1 rounded">
                                                {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : "Present"}
                                            </span>
                                        </div>

                                        <div className="relative group">
                                            {/* Glow effect */}
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                                            <div className="bg-card p-6 rounded-lg relative">
                                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                                                <h3 className="text-xl font-bold">{exp.position}</h3>
                                                <p className="text-lg text-primary font-medium">{exp.company}</p>

                                                {/* Description Text */}
                                                {desc.text && (
                                                    <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
                                                        {desc.text}
                                                    </p>
                                                )}

                                                {/* Bullet Points */}
                                                {desc.bullets.length > 0 && (
                                                    <ul className="mt-4 space-y-2">
                                                        {desc.bullets.map((bullet, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                                                <span className="text-primary mt-1.5 text-xs">●</span>
                                                                <span className="leading-relaxed">{bullet}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {experiences.length === 0 && (
                        <motion.div
                            className="flex flex-col items-center justify-center py-20 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-600/20 flex items-center justify-center"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <svg className="w-12 h-12 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </motion.div>
                            <p className="text-lg text-muted-foreground mb-2">No experience entries yet</p>
                            <p className="text-sm text-muted-foreground/60">Experience timeline will appear here once added</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    )
}

