"use client"

import { Canvas } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { useTheme } from "@/components/providers/theme-provider"
import { useEffect, useState, Suspense } from "react"
import { EarthDark } from "./earth-dark"
import { EarthLight } from "./earth-light"

// Fallback component when WebGL fails
function EarthFallback({ isLightMode }: { isLightMode: boolean }) {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div
                className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full animate-spin-slow"
                style={{
                    background: isLightMode
                        ? 'radial-gradient(circle at 30% 30%, #e0f2fe, #0ea5e9)'
                        : 'radial-gradient(circle at 30% 30%, #1e3a5f, #0a1628)',
                    boxShadow: isLightMode
                        ? '0 0 60px rgba(14, 165, 233, 0.3)'
                        : '0 0 60px rgba(0, 170, 255, 0.3)',
                    animationDuration: '20s',
                }}
            >
                {/* Wireframe effect using CSS */}
                <div
                    className="absolute inset-0 rounded-full opacity-30"
                    style={{
                        backgroundImage: `
                            linear-gradient(0deg, transparent 49%, ${isLightMode ? '#0ea5e9' : '#00aaff'} 50%, transparent 51%),
                            linear-gradient(90deg, transparent 49%, ${isLightMode ? '#0ea5e9' : '#00aaff'} 50%, transparent 51%)
                        `,
                        backgroundSize: '30px 30px',
                    }}
                />
                {/* Latitude lines */}
                <div
                    className="absolute inset-4 rounded-full opacity-20"
                    style={{
                        border: `1px solid ${isLightMode ? '#0ea5e9' : '#00aaff'}`,
                    }}
                />
                <div
                    className="absolute inset-8 rounded-full opacity-20"
                    style={{
                        border: `1px solid ${isLightMode ? '#0ea5e9' : '#00aaff'}`,
                    }}
                />
                <div
                    className="absolute inset-12 rounded-full opacity-20"
                    style={{
                        border: `1px solid ${isLightMode ? '#0ea5e9' : '#00aaff'}`,
                    }}
                />
            </div>
        </div>
    )
}

// Check if WebGL is available
function isWebGLAvailable(): boolean {
    if (typeof window === 'undefined') return false
    try {
        const canvas = document.createElement('canvas')
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        )
    } catch (e) {
        return false
    }
}

export function EarthWireframe() {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [hasWebGL, setHasWebGL] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        setMounted(true)
        setHasWebGL(isWebGLAvailable())
    }, [])

    if (!mounted) return null

    const isLightMode = theme === "sky"
    const fogColor = isLightMode ? '#ffffff' : '#030712'

    // If WebGL is not available or there was an error, show fallback
    if (!hasWebGL || hasError) {
        return (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-[400px] md:h-[600px] overflow-hidden pointer-events-none z-[-100]">
                <EarthFallback isLightMode={isLightMode} />
            </div>
        )
    }

    return (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-[400px] md:h-[600px] overflow-hidden pointer-events-none z-[-100]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{
                    alpha: true,
                    antialias: true,
                    powerPreference: "high-performance",
                    failIfMajorPerformanceCaveat: false,
                }}
                style={{ background: 'transparent' }}
                onCreated={({ gl }) => {
                    // Handle context loss
                    gl.domElement.addEventListener('webglcontextlost', (event) => {
                        event.preventDefault()
                        console.warn('WebGL context lost')
                        setHasError(true)
                    })
                }}
            >
                <Suspense fallback={null}>
                    {/* Fog for depth effect */}
                    <fog attach="fog" args={[fogColor, 5, 20]} />
                    <ambientLight intensity={isLightMode ? 2 : 0.5} />
                    <pointLight position={[10, 10, 10]} intensity={isLightMode ? 2 : 1} />

                    {/* Conditionally render Earth based on theme */}
                    {isLightMode ? (
                        <EarthLight />
                    ) : (
                        <>
                            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                            <EarthDark />
                            <EffectComposer>
                                <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={100} intensity={1} />
                            </EffectComposer>
                        </>
                    )}
                </Suspense>
            </Canvas>
        </div>
    )
}
