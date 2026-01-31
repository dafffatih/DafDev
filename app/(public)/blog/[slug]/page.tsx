
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const revalidate = 60

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
    })

    if (!post || (!post.published && process.env.NODE_ENV !== 'development')) {
        notFound()
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
            <Link href="/">
                <Button variant="ghost" size="sm" className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Button>
            </Link>

            <article className="max-w-3xl mx-auto space-y-8">
                <header className="space-y-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black bg-none dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-br dark:from-gray-500 dark:to-gray-400">
                        {post.title}
                    </h1>
                </header>

                {post.coverImage && (
                    <div className="rounded-xl overflow-hidden aspect-video border border-border/50 shadow-lg">
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <div
                    className="prose prose-lg px-2 sm:px-0 dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-p:text-black dark:prose-p:text-white prose-headings:text-black dark:prose-headings:text-white"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>
        </div>
    )
}
