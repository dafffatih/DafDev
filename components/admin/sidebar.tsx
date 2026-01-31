"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"
import {
    LayoutDashboard,
    FolderGit2,
    BriefcaseBusiness,
    PenTool,
    FileText,
    Settings,
    LogOut,
    Mail
} from "lucide-react"

const sidebarItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
    { href: "/admin/experience", label: "Experience", icon: BriefcaseBusiness },
    { href: "/admin/skills", label: "Skills", icon: PenTool },
    { href: "/admin/blog", label: "Blog", icon: FileText },
    { href: "/admin/messages", label: "Messages", icon: Mail },
    { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {

    const pathname = usePathname()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        // Use window.location to ensure correct domain
        window.location.href = "/login"
    }

    return (
        <aside className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 hidden md:flex">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold tracking-tight">Admin CMS</h2>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    )
}
