import { AdminSidebar } from "@/components/admin/sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // Middleware handles protection
    if (!session) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminSidebar />
            <main className="md:ml-64 p-8">
                <div className="py-2">
                    {children}
                </div>
            </main>
        </div>
    )
}
