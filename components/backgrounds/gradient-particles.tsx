"use client"

import { useEffect, useMemo } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface LightParticle {
    id: number
    size: number
    y: number
    duration: number
    delay: number
    opacity: number
    color: string
}

interface GradientLayer {
    id: number
    color: string
    size: number
    x: number
    y: number
}

export function GradientParticles() {
    // Replace useState with useMotionValue for performance
    // This avoids re-rendering the reactant component on every mouse move
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Smooth springs for the first element
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 }
    const springX = useSpring(mouseX, springConfig)
    const springY = useSpring(mouseY, springConfig)

    // Layered gradient backgrounds for depth - MORE VISIBLE with vibrant colors
    // Memoized to prevent recreation on re-renders (though we shouldn't be re-rendering much now)
    const gradientLayers = useMemo<GradientLayer[]>(() => [
        // Deep purple/pink like reference image 1
        { id: 1, color: "rgba(219, 39, 119, 0.45)", size: 900, x: -10, y: -5 },
        // Coral/orange glow
        { id: 2, color: "rgba(251, 146, 60, 0.35)", size: 700, x: 70, y: 5 },
        // Deep blue like reference image 2
        { id: 3, color: "rgba(59, 130, 246, 0.40)", size: 1000, x: 50, y: 40 },
        // Magenta/pink accent
        { id: 4, color: "rgba(236, 72, 153, 0.38)", size: 800, x: 80, y: 60 },
        // Purple depth
        { id: 5, color: "rgba(139, 92, 246, 0.42)", size: 850, x: 20, y: 70 },
        // Cyan/teal accent like reference image 3
        { id: 6, color: "rgba(34, 211, 238, 0.30)", size: 600, x: 40, y: 20 },
    ], [])

    // Small floating light particles
    const particles = useMemo<LightParticle[]>(() => {
        const colors = [
            "rgba(244, 114, 182, 0.6)", // pink
            "rgba(96, 165, 250, 0.5)",  // blue
            "rgba(52, 211, 153, 0.5)",  // green
            "rgba(167, 139, 250, 0.5)", // purple
            "rgba(251, 191, 36, 0.4)",  // amber
            "rgba(255, 255, 255, 0.6)", // white
        ]

        return Array.from({ length: 35 }, (_, i) => ({
            id: i,
            size: Math.random() * 4 + 2, // 2-6px
            y: Math.random() * 100,
            duration: Math.random() * 30 + 25, // 25-55s (very slow)
            delay: Math.random() * 20,
            opacity: Math.random() * 0.4 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
        }))
    }, [])

    // Mouse tracking - ONLY updates motion values, no state updates
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [mouseX, mouseY])

    // Create a trail of springs
    // managing array of springs is tricky in hooks, so we create a small component helper
    // or just map a fixed number since we know it's 12
    const trailCount = 6
    const trails = Array.from({ length: trailCount }).map((_, i) => i)

    return (
        <>
            {/* Layered gradient backgrounds for depth */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {gradientLayers.map((layer) => (
                    <motion.div
                        key={layer.id}
                        className="absolute rounded-full"
                        style={{
                            width: layer.size,
                            height: layer.size,
                            left: `${layer.x}%`,
                            top: `${layer.y}%`,
                            background: `radial-gradient(circle, ${layer.color} 0%, transparent 60%)`,
                        }}
                        animate={{
                            x: [0, 150, -100, 200, -50, 0],
                            y: [0, -100, 150, -50, 100, 0],
                            scale: [1, 1.3, 0.9, 1.2, 0.95, 1],
                            opacity: [0.6, 0.9, 0.5, 0.8, 0.7, 0.6],
                        }}
                        transition={{
                            duration: 15 + layer.id * 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Small floating light particles moving left to right */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            top: `${particle.y}%`,
                            left: "-5%",
                            background: particle.color,
                            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                        }}
                        animate={{
                            x: ["0vw", "110vw"],
                            opacity: [0, particle.opacity, particle.opacity, 0],
                        }}
                        transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            repeat: Infinity,
                            ease: "linear",
                            times: [0, 0.1, 0.9, 1], // fade in at start, fade out at end
                        }}
                    />
                ))}
            </div>

            {/* Mouse follower gradient with trail effect */}
            {trails.map((i) => (
                <TrailItem
                    key={i}
                    index={i}
                    mouseX={mouseX}
                    mouseY={mouseY}
                />
            ))}
        </>
    )
}

function TrailItem({ index, mouseX, mouseY }: { index: number, mouseX: any, mouseY: any }) {
    // Create a unique spring for each trail item, with increasing delay/lag
    // We achieve "lag" by making the spring softer (lower stiffness, higher damping) as index increases
    const springConfig = useMemo(() => ({
        damping: 25 + index * 5,
        stiffness: Math.max(150 - index * 10, 50),
        mass: 0.5 + index * 0.1
    }), [index])

    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    const size = Math.max(300 - index * 20, 100) // Increased size: Wide but thin
    const opacity = Math.max(0.04 - index * 0.005, 0.005) // Even fainter opacity


    // Gradient definitions
    const background = index === 0
        ? "radial-gradient(circle, rgba(244,114,182,0.15) 0%, rgba(192,132,252,0.10) 40%, transparent 70%)"
        : `radial-gradient(circle, rgba(192,132,252,${opacity}) 0%, rgba(139,92,246,${opacity * 0.6}) 40%, transparent 70%)`

    return (
        <motion.div
            className="fixed pointer-events-none z-[1]"
            style={{
                left: 0,
                top: 0,
                x, // Framer motion optimizes this to transform: translateX
                y, // Framer motion optimizes this to transform: translateY
                translateX: "-50%", // Center the div on the coordinate
                translateY: "-50%",
            }}
        >
            <div
                className="rounded-full"
                style={{
                    width: size,
                    height: size,
                    background,
                }}
            />
        </motion.div>
    )
}
