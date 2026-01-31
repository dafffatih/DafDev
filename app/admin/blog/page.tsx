
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Eye } from "lucide-react"
import { deletePost } from "@/app/actions/admin"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function AdminBlogPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                <Link href="/admin/blog/new">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" /> New Post
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card key={post.id} className="flex flex-col">
                        <CardHeader className="p-4">
                            <CardTitle className="flex flex-col gap-2">
                                <span className="line-clamp-2">{post.title}</span>
                                <span className={`text-xs w-fit px-2 py-1 rounded-full ${post.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {post.published ? "Published" : "Draft"}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-end space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {post.excerpt || post.content.substring(0, 100)}...
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t mt-auto">
                                <span className="text-xs text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/blog/${post.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <DeleteButton
                                        id={post.id}
                                        action={deletePost}
                                        title={post.title}
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {posts.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                        No blog posts yet. Write something!
                    </div>
                )}
            </div>
        </div>
    )
}
