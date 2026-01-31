"use client"

import { useLanguage } from "@/components/providers/language-provider"
import { Globe } from "lucide-react"
import { useEffect, useState } from "react"

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-9 h-9 flex items-center justify-center">
                <div className="w-5 h-5 bg-muted rounded-full animate-pulse" />
            </div>
        )
    }

    return (
        <button
            onClick={() => setLanguage(language === "en" ? "id" : "en")}
            className="p-2 rounded-full hover:bg-muted transition-colors flex items-center gap-2 font-medium text-sm"
            aria-label="Toggle language"
        >
            <Globe className="w-4 h-4" />
            <span>{language.toUpperCase()}</span>
        </button>
    )
}
