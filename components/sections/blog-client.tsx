"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"

type Post = {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    published: boolean
    coverImage: string | null
    createdAt: Date
    updatedAt: Date
}

interface BlogClientProps {
    posts: Post[]
}

export function BlogClient({ posts }: BlogClientProps) {
    const { t } = useLanguage()

    return (
        <section id="blog" className="min-h-screen flex flex-col justify-center py-24 px-4 container mx-auto">
            <div className="max-w-5xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-normal bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-400 text-shadow-sm">
                        {t.blog.title}
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-shadow-sm">
                        {t.blog.subtitle}
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <Link href={`/blog/${post.slug}`} className="group h-full block relative">
                                {/* Glow effect */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

                                <Card className="relative h-full flex flex-col overflow-hidden transition-colors duration-300 bg-card border-none shadow-none">
                                    {post.coverImage && (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    )}
                                    <CardHeader>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                                            {post.excerpt || post.content.substring(0, 150)}...
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-0 text-sm font-medium text-primary flex items-center gap-2">
                                        {t.blog.readMore} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </CardFooter>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {posts.length === 0 && (
                    <motion.div
                        className="flex flex-col items-center justify-center py-20 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-400/20 flex items-center justify-center"
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <svg className="w-12 h-12 text-pink-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </motion.div>
                        <p className="text-lg text-muted-foreground mb-2">{t.blog.noPosts}</p>
                        <p className="text-sm text-muted-foreground/60">Blog articles will appear here once published</p>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
