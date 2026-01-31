"use client"

import { useEffect, useRef, useCallback } from "react"

export function CustomScrollbar() {
    const thumbRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const thumbHeight = useRef(100)
    const rafId = useRef<number>(0)

    // Calculate thumb height once
    const calculateThumbHeight = useCallback(() => {
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = window.innerHeight
        const ratio = clientHeight / scrollHeight
        thumbHeight.current = Math.max(ratio * clientHeight, 40)
        return thumbHeight.current
    }, [])

    // Update thumb position based on scroll
    const updateThumbFromScroll = useCallback(() => {
        if (!thumbRef.current || !containerRef.current || isDragging.current) return

        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = window.innerHeight
        const scrollTop = window.scrollY

        const height = calculateThumbHeight()
        const maxScroll = scrollHeight - clientHeight
        const percent = maxScroll > 0 ? scrollTop / maxScroll : 0
        const trackHeight = clientHeight - height
        const thumbTop = percent * trackHeight

        thumbRef.current.style.height = `${height}px`
        thumbRef.current.style.transform = `translateY(${thumbTop}px)`
        containerRef.current.style.display = maxScroll > 0 ? "block" : "none"
    }, [calculateThumbHeight])

    // Scroll handler
    const handleScroll = useCallback(() => {
        if (rafId.current) cancelAnimationFrame(rafId.current)
        rafId.current = requestAnimationFrame(updateThumbFromScroll)
    }, [updateThumbFromScroll])

    useEffect(() => {
        updateThumbFromScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
            window.removeEventListener("resize", handleScroll)
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [handleScroll, updateThumbFromScroll])

    // Direct drag - thumb follows mouse immediately
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        isDragging.current = true
        document.body.style.userSelect = "none"
        document.body.style.cursor = "grabbing"

        if (thumbRef.current) {
            thumbRef.current.style.opacity = "1"
            thumbRef.current.style.width = "10px"
            thumbRef.current.style.transition = "none" // Remove transition during drag for instant response
        }
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !thumbRef.current) return

            const clientHeight = window.innerHeight
            const height = thumbHeight.current
            const trackHeight = clientHeight - height

            // Calculate thumb position directly from mouse Y
            // Clamp between 0 and trackHeight
            let newThumbTop = e.clientY - (height / 2)
            newThumbTop = Math.max(0, Math.min(newThumbTop, trackHeight))

            // Move thumb immediately
            thumbRef.current.style.transform = `translateY(${newThumbTop}px)`

            // Calculate and apply scroll position
            const scrollHeight = document.documentElement.scrollHeight
            const maxScroll = scrollHeight - clientHeight
            const percent = newThumbTop / trackHeight
            const newScrollTop = percent * maxScroll

            // Use scrollTo without smooth behavior for immediate response
            window.scrollTo({
                top: newScrollTop,
                behavior: "instant"
            })
        }

        const handleMouseUp = () => {
            if (isDragging.current) {
                isDragging.current = false
                document.body.style.userSelect = ""
                document.body.style.cursor = ""

                if (thumbRef.current) {
                    thumbRef.current.style.opacity = "0.6"
                    thumbRef.current.style.width = "6px"
                    thumbRef.current.style.transition = "width 0.15s ease, opacity 0.15s ease"
                }
            }
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])

    // Click on track to jump
    const handleTrackClick = useCallback((e: React.MouseEvent) => {
        if (e.target === containerRef.current) {
            const clientHeight = window.innerHeight
            const height = calculateThumbHeight()
            const trackHeight = clientHeight - height

            let newThumbTop = e.clientY - (height / 2)
            newThumbTop = Math.max(0, Math.min(newThumbTop, trackHeight))

            const scrollHeight = document.documentElement.scrollHeight
            const maxScroll = scrollHeight - clientHeight
            const percent = newThumbTop / trackHeight
            const newScrollTop = percent * maxScroll

            window.scrollTo({ top: newScrollTop, behavior: "instant" })
        }
    }, [calculateThumbHeight])

    // Hover handlers
    const handleMouseEnter = () => {
        if (thumbRef.current && !isDragging.current) {
            thumbRef.current.style.opacity = "1"
            thumbRef.current.style.width = "10px"
        }
    }

    const handleMouseLeave = () => {
        if (thumbRef.current && !isDragging.current) {
            thumbRef.current.style.opacity = "0.6"
            thumbRef.current.style.width = "6px"
        }
    }

    return (
        <div
            ref={containerRef}
            className="fixed right-1 top-0 bottom-0 w-3 z-[9999] cursor-pointer"
            onClick={handleTrackClick}
        >
            <div
                ref={thumbRef}
                className="absolute right-0 rounded-full cursor-grab active:cursor-grabbing"
                style={{
                    width: 6,
                    background: "linear-gradient(180deg, var(--primary), #a855f7)",
                    opacity: 0.6,
                    willChange: "transform",
                    transition: "width 0.15s ease, opacity 0.15s ease",
                }}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        </div>
    )
}
