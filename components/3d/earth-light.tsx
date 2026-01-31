"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import * as THREE from "three"

export function EarthLight() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05
        }
    })

    return (
        <group rotation={[0, 0, 0]} position={[0, -10, 0]}>
            {/* Dark/Black Wireframe Sphere */}
            <Sphere args={[1, 32, 32]} ref={meshRef} scale={10}>
                <meshBasicMaterial
                    color="#1e293b" // Dark slate color for softer contrast than pure black
                    wireframe
                    transparent
                    opacity={0.8}
                    wireframeLinewidth={2}
                    side={THREE.FrontSide}
                    toneMapped={false}
                />
            </Sphere>
        </group>
    )
}
