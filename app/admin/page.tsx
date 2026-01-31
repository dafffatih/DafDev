import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    FolderGit2,
    BriefcaseBusiness,
    PenTool,
    FileText
} from "lucide-react"
import { getDashboardStats } from "@/actions/dashboard"

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    if (!stats) return null

    const dashboardItems = [
        { href: "/admin/projects", label: "Total Projects", icon: FolderGit2, count: stats.projects, color: "text-blue-500" },
        { href: "/admin/experience", label: "Experience Entries", icon: BriefcaseBusiness, count: stats.experience, color: "text-green-500" },
        { href: "/admin/skills", label: "Skills Listed", icon: PenTool, count: stats.skills, color: "text-purple-500" },
        { href: "/admin/blog", label: "Blog Posts", icon: FileText, count: stats.posts, color: "text-pink-500" },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening in your portfolio.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {dashboardItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full border-muted/50 shadow-sm hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {item.label}
                                </CardTitle>
                                <item.icon className={`h-4 w-4 ${item.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{item.count}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Manage your {item.label.toLowerCase()}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Placeholder for Recent Activity or Analytics */}
            </div>
        </div>
    )
}
