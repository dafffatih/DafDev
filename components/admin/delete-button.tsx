"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface DeleteButtonProps {
    id: string
    action: (id: string) => Promise<{ success: boolean; error?: string }>
    title?: string // The item name/title to show in confirmation
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    className?: string
}

export function DeleteButton({
    id,
    action,
    title = "this item",
    variant = "destructive",
    size = "sm",
    className
}: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        const confirmMessage = `Are you sure you want to delete ${title}?`

        if (window.confirm(confirmMessage)) {
            setIsDeleting(true)
            try {
                const result = await action(id)
                if (result.success) {
                    // Success is handled by revalidatePath in the action, 
                    // but we can also refresh router to be safe for client-side fetches
                    router.refresh()
                } else {
                    alert(result.error || "Failed to delete item")
                }
            } catch (error) {
                alert("An unexpected error occurred")
            } finally {
                setIsDeleting(false)
            }
        }
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleDelete}
            disabled={isDeleting}
            className={cn(className)}
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
        </Button>
    )
}
