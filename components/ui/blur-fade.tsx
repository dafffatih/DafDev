"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"

interface BlurFadeProps {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    yOffset?: number
    once?: boolean
}

const blurFadeVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: "blur(12px)",
        y: 20,
    },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
    },
}

export function BlurFade({
    children,
    className = "",
    delay = 0,
    duration = 0.6,
    yOffset = 20,
    once = false,
}: BlurFadeProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: "-50px" }}
            variants={{
                hidden: {
                    opacity: 0,
                    filter: "blur(12px)",
                    y: yOffset,
                },
                visible: {
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                },
            }}
            transition={{
                duration,
                delay,
                ease: "easeOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Stagger container for multiple children
interface BlurFadeContainerProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
    once?: boolean
}

export function BlurFadeContainer({
    children,
    className = "",
    staggerDelay = 0.1,
    once = false,
}: BlurFadeContainerProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once, margin: "-50px" }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Item variant for use inside BlurFadeContainer
export const blurFadeItemVariants: Variants = {
    hidden: {
        opacity: 0,
        filter: "blur(10px)",
        y: 15,
    },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
}
