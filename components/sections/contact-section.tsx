"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send, Mail, MapPin, Phone, Github, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"
import { EarthWireframe } from "@/components/3d/earth-wireframe"

export function ContactSection() {
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to send")
            }

            setSuccess(true)
            setFormData({ name: "", email: "", message: "" })
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="contact" className="min-h-screen flex flex-col justify-center py-24 px-4 container mx-auto relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto items-start z-10">
                {/* Left Side: Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 text-shadow-sm">
                            {t.contact.title}
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-shadow-sm">
                            {t.contact.subtitle}
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground hover:text-primary transition-colors">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-secondary/50 rounded-full flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-sm sm:text-base md:text-lg break-all">daffamalfatih.3135@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground hover:text-primary transition-colors">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-secondary/50 rounded-full flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-sm sm:text-base md:text-lg break-words">+62 857 8991 9805</span>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground hover:text-primary transition-colors">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-secondary/50 rounded-full flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-sm sm:text-base md:text-lg break-words">Lampung, Indonesia</span>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Link href="https://github.com/dafffatih" target="_blank" className="p-3 bg-secondary/50 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="https://www.linkedin.com/in/daffamalfatih" target="_blank" className="p-3 bg-secondary/50 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                        <Link href="https://www.instagram.com/dafffatih_/" target="_blank" className="p-3 bg-secondary/50 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300 hover:scale-110">
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <Link href="https://wa.me/qr/PUOGDZVIYKK2M1" target="_blank" className="p-3 bg-secondary/50 rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:scale-110">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                        </Link>
                    </div>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                        <Card className="relative border-muted/50 shadow-xl bg-card/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>{t.contact.title}</CardTitle>
                                <CardDescription>
                                    {t.contact.form.successDesc}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {success ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in zoom-in">
                                        <div className="h-16 w-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                                            <Send className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{t.contact.form.successTitle}</h3>
                                        <p className="text-muted-foreground">{t.contact.form.successDesc}</p>
                                        <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">
                                            {t.contact.form.sendAnother}
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">{t.contact.form.name}</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder={t.contact.form.placeholderName}
                                                className="bg-background/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">{t.contact.form.email}</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder={t.contact.form.placeholderEmail}
                                                className="bg-background/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">{t.contact.form.message}</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                                placeholder={t.contact.form.placeholderMessage}
                                                className="min-h-[150px] bg-background/50"
                                            />
                                        </div>
                                        <Button type="submit" className="w-full gap-2" disabled={loading}>
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            {loading ? t.contact.form.sending : t.contact.form.send}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>

            {/* 3D Earth Background */}
            <div className="absolute bottom-[-100px] left-0 right-0 h-[50vh] z-0 opacity-50 pointer-events-none">
                <EarthWireframe />
            </div>
        </section>
    )
}
