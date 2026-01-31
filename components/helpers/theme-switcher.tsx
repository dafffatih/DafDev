"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
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
            onClick={() => setTheme(theme === "space" ? "sky" : "space")}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
        >
            {theme === "space" ? (
                <Moon className="w-5 h-5 text-indigo-400" />
            ) : (
                <Sun className="w-5 h-5 text-orange-400" />
            )}
        </button>
    )
}
