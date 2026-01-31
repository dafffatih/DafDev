"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ThemeSwitcher } from "@/components/helpers/theme-switcher"
import { LanguageSwitcher } from "@/components/helpers/language-switcher"
import { useLanguage } from "@/components/providers/language-provider"
import { Link as ScrollLink } from "react-scroll"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const { t } = useLanguage()
    const isHome = pathname === "/"

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { id: "home", path: "/", label: t.nav.home },
        { id: "about", path: "/#about", label: t.nav.about },
        { id: "skills", path: "/#skills", label: t.nav.skills },
        { id: "projects", path: "/#projects", label: t.nav.projects },
        { id: "experience", path: "/#experience", label: t.nav.experience },
        { id: "blog", path: "/#blog", label: t.nav.blog },
        { id: "contact", path: "/#contact", label: t.nav.contact },
    ]

    return (
        <motion.nav
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-background/50 backdrop-blur-sm border-b border-border/50 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold tracking-tighter hover:scale-105 transition-transform">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500">
                        DafDev
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <ul className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                {isHome ? (
                                    <ScrollLink
                                        to={link.id}
                                        spy={true}
                                        smooth={true}
                                        offset={-80}
                                        duration={800}
                                        className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                                        activeClass="text-primary font-bold"
                                    >
                                        {link.label}
                                        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 transition-transform origin-right group-hover:scale-x-100 group-hover:origin-left" />
                                    </ScrollLink>
                                ) : (
                                    <Link
                                        href={link.path}
                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                                    >
                                        {link.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="h-4 w-[1px] bg-border mx-2" />

                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeSwitcher />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-border"
                    >
                        <div className="w-full px-4 sm:px-6 py-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <div key={link.id}>
                                    {isHome ? (
                                        <ScrollLink
                                            to={link.id}
                                            spy={true}
                                            smooth={true}
                                            offset={-80}
                                            duration={800}
                                            className="block text-base font-medium py-2 border-b border-border/50 text-muted-foreground active:text-primary"
                                            activeClass="text-primary font-bold"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </ScrollLink>
                                    ) : (
                                        <Link
                                            href={link.path}
                                            className="block text-base font-medium py-2 border-b border-border/50 text-muted-foreground"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="flex items-center gap-4 mt-2 pt-4 border-t border-border">
                                <LanguageSwitcher />
                                <ThemeSwitcher />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
