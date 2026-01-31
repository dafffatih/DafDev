import { format } from "date-fns"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { deleteMessage } from "@/app/actions/admin"
import { DeleteButton } from "@/components/admin/delete-button"

export default async function MessagesPage() {
    const messages = await prisma.message.findMany({
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <div className="space-y-8 text-foreground">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground">
                        View messages sent from the contact form.
                    </p>
                </div>
            </div>

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Inbox
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {messages.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No messages found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-muted/50 border-border">
                                    <TableHead className="text-muted-foreground">Date</TableHead>
                                    <TableHead className="text-muted-foreground">Name</TableHead>
                                    <TableHead className="text-muted-foreground">Email</TableHead>
                                    <TableHead className="text-muted-foreground">Message</TableHead>
                                    <TableHead className="text-muted-foreground w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.map((msg) => (
                                    <TableRow key={msg.id} className="hover:bg-muted/50 border-border">
                                        <TableCell className="whitespace-nowrap font-medium">
                                            {format(new Date(msg.createdAt), "MMM d, yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell>{msg.name}</TableCell>
                                        <TableCell>{msg.email}</TableCell>
                                        <TableCell className="max-w-md truncate" title={msg.message}>
                                            {msg.message}
                                        </TableCell>
                                        <TableCell>
                                            <DeleteButton
                                                id={msg.id}
                                                action={deleteMessage}
                                                title={`message from ${msg.name}`}
                                                className="h-8 w-8 p-0"
                                                variant="ghost"
                                                size="icon"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
