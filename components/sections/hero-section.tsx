"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"
import { Link as ScrollLink } from "react-scroll"
import { ArrowRight, Code2, Cpu, Database, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Floating tech icons for background decoration
const floatingIcons = [
    { Icon: Code2, delay: 0, x: -200, y: -100 },
    { Icon: Database, delay: 0.5, x: 150, y: -140 },
    { Icon: Cpu, delay: 1, x: -180, y: 120 },
    { Icon: Sparkles, delay: 1.5, x: 220, y: 100 },
]

export function HeroSection() {
    const { t } = useLanguage()

    return (
        <section id="home" className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 relative overflow-hidden">
            {/* Floating Tech Icons - Background Decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                {floatingIcons.map(({ Icon, delay, x, y }, index) => (
                    <motion.div
                        key={index}
                        className="absolute left-1/2 top-1/2"
                        initial={{ opacity: 0, x, y, scale: 0 }}
                        animate={{
                            opacity: 1,
                            x,
                            y,
                            scale: 1,
                        }}
                        transition={{
                            delay: delay + 0.5,
                            duration: 1,
                            ease: "easeOut"
                        }}
                    >
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 4 + index,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Icon className="w-12 h-12 md:w-16 md:h-16 text-white-700" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Gradient Orbs - Background Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
                    style={{
                        background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                        top: "20%",
                        left: "-10%",
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
                    style={{
                        background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
                        bottom: "10%",
                        right: "-5%",
                    }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Content wrapper with z-index to sit above background */}
            <div className="z-10 flex flex-col items-center text-center max-w-5xl mx-auto gap-6 md:gap-8 px-4">

                {/* Animated Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-4"
                >
                    {/* Subtitle with animated underline */}
                    <motion.h2
                        className="text-xl md:text-2xl font-medium tracking-wide uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span
                            className="animate-gradient-x"
                            style={{
                                background: 'linear-gradient(90deg, var(--primary), #a855f7, #ec4899, var(--primary))',
                                backgroundSize: '200% 100%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            {t.home.hero.subtitle}
                        </span>
                    </motion.h2>

                    {/* Main title with name */}
                    <div className="space-y-2">
                        <motion.p
                            className="text-lg md:text-xl text-muted-foreground"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            Hi, I&apos;m
                        </motion.p>
                        <motion.h1
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground"
                        >
                            {t.home.hero.title}
                        </motion.h1>
                    </div>
                </motion.div>

                {/* Description with stagger animation */}
                <motion.p
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed text-shadow-sm px-2"
                >
                    {t.home.hero.description}
                </motion.p>

                {/* CTA Buttons with glow effect */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                    <ScrollLink
                        to="projects"
                        smooth={true}
                        offset={-20}
                        duration={800}
                        className={cn(
                            "h-12 px-8 rounded-full flex items-center justify-center gap-2 text-base font-medium transition-all duration-300 cursor-pointer",
                            "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
                            "shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                        )}
                    >
                        {t.home.hero.cta} <ArrowRight className="w-4 h-4" />
                    </ScrollLink>

                    <ScrollLink
                        to="contact"
                        smooth={true}
                        offset={-20}
                        duration={800}
                        className={cn(
                            "h-12 px-8 rounded-full flex items-center justify-center gap-2 text-base font-medium transition-all duration-300 cursor-pointer",
                            "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 border border-border/50 hover:border-primary/50 hover:scale-105",
                            "backdrop-blur-sm"
                        )}
                    >
                        {t.nav.contact}
                    </ScrollLink>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 animate-bounce"
            >
                <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-1">
                    <motion.div
                        className="w-1 h-2 bg-primary rounded-full"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </section>
    )
}
