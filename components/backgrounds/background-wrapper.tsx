"use client"

import { useTheme } from "@/components/providers/theme-provider"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"

// Dynamically import heavy 3D components
const SpaceBackground = dynamic(() => import("./space-background").then(m => m.SpaceBackground), { ssr: false })
const SkyBackground = dynamic(() => import("./sky-background").then(m => m.SkyBackground), { ssr: false })

export function BackgroundWrapper() {
    const { theme } = useTheme()

    return (
        <>
            <AnimatePresence mode="wait">
                {theme === "space" ? (
                    <motion.div
                        key="space"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 z-[-1]"
                    >
                        <SpaceBackground />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sky"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 z-[-1]"
                    >
                        <SkyBackground />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
