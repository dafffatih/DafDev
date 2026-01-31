"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import { GradientParticles } from "./gradient-particles"

function StarField(props: any) {
    const ref = useRef<any>(null)

    const [positions] = useMemo(() => {
        const count = 3000
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const r = 1.2 * Math.cbrt(Math.random())
            const theta = Math.random() * 2 * Math.PI
            const phi = Math.acos(2 * Math.random() - 1)

            const x = (Math.random() - 0.5) * 20
            const y = (Math.random() - 0.5) * 20
            const z = (Math.random() - 0.5) * 20

            positions[i * 3] = x
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = z
        }
        return [positions]
    }, [])

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 50
            ref.current.rotation.y -= delta / 35
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#f272c8"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

function Stars(props: any) {
    const ref = useRef<any>(null)
    const count = 1000
    const [positions] = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
        return [positions]
    }, [])

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta / 20
        }
    })

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </Points>
    )
}

export function SpaceBackground() {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#050508]">
            {/* Gradient particles behind stars */}
            <GradientParticles />

            {/* 3D Star field */}
            <Canvas camera={{ position: [0, 0, 2] }}>
                <StarField />
                <Stars />
                <ambientLight intensity={0.5} />
            </Canvas>

            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />
        </div>
    )
}
