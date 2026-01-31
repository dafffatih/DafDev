"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "space" | "sky"

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: "space",
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "space",
    storageKey = "ui-theme",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const storedTheme = localStorage.getItem(storageKey) as Theme
        if (storedTheme) {
            setTheme(storedTheme)
        }
    }, [storageKey])

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("space", "sky")
        root.setAttribute("data-theme", theme)
        // Also add class for Tailwind dark mode if using 'class' strategy (optional but good practice)
        if (theme === "space") {
            root.classList.add("dark")
        } else {
            root.classList.remove("dark")
        }
        localStorage.setItem(storageKey, theme)
    }, [theme, storageKey])

    if (!mounted) {
        // Avoid hydration mismatch by rendering nothing or a loader
        // Alternatively, render children but theme might be wrong for a split second
        return <>{children}</>
    }

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
