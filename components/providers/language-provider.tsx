"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { en } from "@/locales/en"
import { id } from "@/locales/id"

type Language = "en" | "id"
// Helper type to widen string literals to string
type RecursivelyReplace<T> = T extends string ? string : { [K in keyof T]: RecursivelyReplace<T[K]> }
type Dictionary = RecursivelyReplace<typeof en>

interface LanguageProviderProps {
    children: React.ReactNode
    defaultLanguage?: Language
    storageKey?: string
}

interface LanguageProviderState {
    language: Language
    setLanguage: (language: Language) => void
    t: Dictionary
}

const initialState: LanguageProviderState = {
    language: "en",
    setLanguage: () => null,
    t: en,
}

const LanguageProviderContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
    children,
    defaultLanguage = "en",
    storageKey = "ui-language",
}: LanguageProviderProps) {
    const [language, setLanguage] = useState<Language>(defaultLanguage)
    const [mounted, setMounted] = useState(false)

    const t = (language === "en" ? en : id) as unknown as Dictionary

    useEffect(() => {
        setMounted(true)
        const storedLanguage = localStorage.getItem(storageKey) as Language
        if (storedLanguage && (storedLanguage === "en" || storedLanguage === "id")) {
            setLanguage(storedLanguage)
        }
    }, [storageKey])

    useEffect(() => {
        localStorage.setItem(storageKey, language)
    }, [language, storageKey])

    if (!mounted) {
        return <>{children}</>
    }

    const value = {
        language,
        setLanguage,
        t,
    }

    return (
        <LanguageProviderContext.Provider value={value}>
            {children}
        </LanguageProviderContext.Provider>
    )
}

export const useLanguage = () => {
    const context = useContext(LanguageProviderContext)

    if (context === undefined)
        throw new Error("useLanguage must be used within a LanguageProvider")

    return context
}
