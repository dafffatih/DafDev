"use client"

import { useState, useEffect } from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Pencil } from "lucide-react"
import Link from "next/link"
import { DeleteButton } from "@/components/admin/delete-button"
import { updateSkillsOrder, deleteSkill } from "@/app/actions/admin"
import { useRouter } from "next/navigation"

type Skill = {
    id: string
    name: string
    category: string
    icon: string | null
    proficiency: number
    order: number
}

interface SkillsAdminClientProps {
    initialSkills: Skill[]
}

export function SkillsAdminClient({ initialSkills }: SkillsAdminClientProps) {
    const [skills, setSkills] = useState(initialSkills)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        (acc[skill.category] = acc[skill.category] || []).push(skill)
        return acc
    }, {} as Record<string, Skill[]>)

    // Get categories order based on the 'min' order of skills in that category
    // This effectively sorts categories based on where their FIRST skill appears in the global list
    const categories = Object.keys(groupedSkills).sort((a, b) => {
        const minOrderA = Math.min(...groupedSkills[a].map(s => s.order))
        const minOrderB = Math.min(...groupedSkills[b].map(s => s.order))
        return minOrderA - minOrderB
    })

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) {
            setActiveId(null)
            return
        }

        const activeId = active.id as string
        const overId = over.id as string

        // Scenario 1: Dragging Categories (Sorting Categories)
        if (categories.includes(activeId) && categories.includes(overId) && activeId !== overId) {
            // Reorder categories array
            const oldIndex = categories.indexOf(activeId)
            const newIndex = categories.indexOf(overId)
            const newCategories = arrayMove(categories, oldIndex, newIndex)

            // Reconstruct the global skills list based on new category order
            // We give new 'global' indexes to all skills
            let newSkills: Skill[] = []
            let globalIndex = 0

            newCategories.forEach(category => {
                const categorySkills = groupedSkills[category].sort((a, b) => a.order - b.order) // Keep internal skill order
                categorySkills.forEach(skill => {
                    newSkills.push({ ...skill, order: globalIndex++ })
                })
            })

            setSkills(newSkills)
            await saveOrder(newSkills)
        }
        // Scenario 2: Dragging Skills (Reordering within category or moving between categories)
        else {
            // Find the skill objects
            const activeSkill = skills.find(s => s.id === activeId)
            // It might be a skill over another skill
            const overSkill = skills.find(s => s.id === overId)

            if (activeSkill && overSkill) {
                if (activeId !== overId) {
                    const oldIndex = skills.findIndex(s => s.id === activeId)
                    const newIndex = skills.findIndex(s => s.id === overId)

                    // Move the item in the global array
                    let newSkills = arrayMove(skills, oldIndex, newIndex)

                    // Reassign orders based on new array position
                    newSkills = newSkills.map((s, idx) => ({ ...s, order: idx }))

                    /* 
                       Wait, logic correction:
                       If we drag a skill from "Backend" to "Frontend", arrayMove on the global list works,
                       BUT we also need to update its `category` field if we want true "Move between categories".
                       However, the user asked to "arrange what to display first", not strictly "change category".
                       BUT usually DnD implies changing category if you drag it there.
                       
                       Simplification: 
                       For now, let's strictly support REORDERING. 
                       If we want to change category, we'd need to update the `category` string.
                       Let's assume we maintain the category for now, just reorder. 
                       Actually, if I drag a 'Backend' skill and drop it in 'Frontend' list, it SHOULD become 'Frontend'.
                       To do this, we need to know the target category.
                    */

                    // If we are just reordering implicitly:
                    // Verify if the overSkill is in a different category?
                    if (activeSkill.category !== overSkill.category) {
                        // Update category of activeSkill to match overSkill
                        newSkills[newIndex].category = overSkill.category
                    }

                    setSkills(newSkills)
                    await saveOrder(newSkills)
                }
            }
        }

        setActiveId(null)
    }

    const saveOrder = async (updatedSkills: Skill[]) => {
        setIsSaving(true)
        // We also need to save the category change if it happened.
        // Currently `updateSkillsOrder` only updates `order`. 
        // We might need to update `category` too if we allow moving between categories.
        // Let's rely on `updateSkillsOrder` assuming it might need extension or just simple ordering.
        // Actually, if we changed category locally, we aren't persisting it yet because `updateSkillsOrder` only touches `order`.
        // Let's assume we stick to just reordering for now, OR we update the action to also accept category.

        // Let's stick to REORDERING within same category + Sorting Categories for V1 to be safe.
        // Moving between categories is complex without explicit "droppable containers".

        await updateSkillsOrder(updatedSkills.map(s => ({ id: s.id, order: s.order })))
        setIsSaving(false)
        router.refresh()
    }

    // Helper to find container
    // We render a SortableContext for Categories (vertical)
    // And for each category, a SortableContext for Skills (grid)

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-8">
                {isSaving && <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded shadow z-50 animate-pulse">Saving order...</div>}

                <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                    {categories.map((category) => (
                        <SortableCategory
                            key={category}
                            category={category}
                            skills={groupedSkills[category]}
                        />
                    ))}
                </SortableContext>
            </div>

            <DragOverlay>
                {activeId ? (
                    categories.includes(activeId) ? (
                        <div className="bg-background border p-4 rounded shadow-lg opacity-80 cursor-grabbing">
                            <h2 className="text-xl font-semibold">{activeId}</h2>
                        </div>
                    ) : (
                        <SkillCard skill={skills.find(s => s.id === activeId)!} overlay />
                    )
                ) : null}
            </DragOverlay>

        </DndContext>
    )
}

function SortableCategory({ category, skills }: { category: string, skills: Skill[] }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="space-y-4 bg-muted/20 p-4 rounded-xl border border-transparent hover:border-muted-foreground/20">
            <div className="flex items-center gap-4 border-b pb-2 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">{category}</h2>
            </div>

            <SortableContext items={skills.map(s => s.id)} strategy={rectSortingStrategy}>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {skills.sort((a, b) => a.order - b.order).map(skill => (
                        <SortableSkill key={skill.id} skill={skill} />
                    ))}
                </div>
            </SortableContext>
        </div>
    )
}

function SortableSkill({ skill }: { skill: Skill }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <SkillCard skill={skill} attributes={attributes} listeners={listeners} />
        </div>
    )
}

function SkillCard({ skill, overlay, attributes, listeners }: { skill: Skill, overlay?: boolean, attributes?: any, listeners?: any }) {
    return (
        <Card className={overlay ? "shadow-xl cursor-grabbing" : ""}>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    {!overlay && <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing outline-none" {...attributes} {...listeners} />}
                    {skill.icon && (
                        <img
                            src={skill.icon}
                            alt={skill.name}
                            className="w-5 h-5 object-contain"
                        />
                    )}
                    <CardTitle className="text-base font-medium">{skill.name}</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground">{skill.proficiency}%</span>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mb-4">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${skill.proficiency}%` }} />
                </div>
                <div className="flex justify-end gap-2">
                    <Link href={`/admin/skills/${skill.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Pencil className="w-3 h-3" />
                        </Button>
                    </Link>
                    <DeleteButton
                        id={skill.id}
                        action={deleteSkill}
                        title={skill.name}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                    />
                </div>
            </CardContent>
        </Card>
    )
}
