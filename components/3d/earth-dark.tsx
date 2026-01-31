"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere } from "@react-three/drei"
import * as THREE from "three"

export function EarthDark() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05
        }
    })

    return (
        <group rotation={[0, 0, 0]} position={[0, -10, 0]}>
            {/* Glowing Wireframe Sphere */}
            <Sphere args={[1, 32, 32]} ref={meshRef} scale={10}>
                <meshBasicMaterial
                    color="#00aaff"
                    wireframe
                    transparent
                    opacity={0.8}
                    wireframeLinewidth={3}
                    side={THREE.FrontSide}
                    toneMapped={false}
                />
            </Sphere>

            {/* Inner glow sphere */}
            <Sphere args={[0.98, 32, 32]} scale={10}>
                <meshBasicMaterial
                    color="#0066cc"
                    transparent
                    opacity={0.1}
                    toneMapped={false}
                />
            </Sphere>
        </group>
    )
}
