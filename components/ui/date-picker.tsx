"use client"

import { cn } from "@/lib/utils"

interface DatePickerProps {
    date?: Date
    setDate: (date?: Date) => void
    className?: string
    disabled?: boolean
}

export function DatePicker({ date, setDate, className, disabled }: DatePickerProps) {
    return (
        <input
            type="date"
            disabled={disabled}
            className={cn(
                "w-full rounded-md border border-input bg-black px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                "[&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert",
                className
            )}
            value={date ? date.toISOString().split('T')[0] : ''}
            onChange={(e) => setDate(e.target.valueAsDate || undefined)}
        />
    )
}
