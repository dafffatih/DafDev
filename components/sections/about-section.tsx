"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

export function AboutSection() {
    const { t } = useLanguage()

    const containerVariants = {
        hidden: { opacity: 0, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                staggerChildren: 0.1,
                duration: 0.5,
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" }
    }

    return (
        <section id="about" className="min-h-screen py-24 px-4 container mx-auto relative scroll-mt-20">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-100px" }}
                variants={containerVariants}
                className="max-w-5xl mx-auto space-y-16"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-normal bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-500 text-shadow-sm"
                    >
                        {t.about.title}
                    </motion.h2>
                    <motion.p
                        variants={itemVariants}
                        className="text-lg text-muted-foreground max-w-2xl mx-auto text-shadow-sm"
                    >
                        {t.about.subtitle}
                    </motion.p>
                </div>

                {/* Profile & Bio */}
                <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Image Column */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-5 flex justify-center"
                    >
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden">
                                <Image
                                    src="/images/profile.jpg"
                                    alt="Daffa Muhammad Al Fatih"
                                    fill
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Bio Column */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-7 space-y-6"
                    >
                        <h3 className="text-2xl sm:text-3xl font-bold text-center md:text-left">DAFFA MUHAMMAD AL FATIH</h3>
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-center md:text-left">
                            {t.about.bio}
                        </p>

                        <div className="grid gap-3 pt-4">
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                                <div className="p-2 bg-secondary/50 rounded-full shrink-0"><Mail className="w-4 h-4" /></div>
                                <span className="break-all">daffamalfatih.3135@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                                <div className="p-2 bg-secondary/50 rounded-full shrink-0"><Phone className="w-4 h-4" /></div>
                                <span className="break-words">+62 857 8991 9805</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                                <div className="p-2 bg-secondary/50 rounded-full shrink-0"><MapPin className="w-4 h-4" /></div>
                                <span className="break-words">Lampung, Indonesia</span>
                            </div>
                        </div>
                    </motion.div>
                </div>



            </motion.div>
        </section>
    )
}
