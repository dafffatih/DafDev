"use client"

import { Canvas } from "@react-three/fiber"
import { Sky } from "@react-three/drei"

export function SkyBackground() {
    return (
        <div className="fixed inset-0 z-[-1]">
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} />
                <Sky sunPosition={[10, 10, 0]} turbidity={0.5} rayleigh={0.5} mieCoefficient={0.005} />
            </Canvas>
        </div>
    )
}
