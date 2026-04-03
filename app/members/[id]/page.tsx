import { prisma } from "@/lib/prisma";
import DeleteButton from "../_components/DeleteButton";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    });

    if (!user) return <p>멤버를 찾을 수 없어요.</p>;

    return (
        <main className="max-w-lg mx-auto py-10 px-4">
            <div className="mb-4">
                <Button asChild variant="ghost" size="sm">
                    <Link href="/">← 목록으로</Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{user.email}</p>
                    {user.role && <p className="text-muted-foreground">{user.role}</p>}
                    {user.imageUrl && (
                        <Image
                            src={user.imageUrl}
                            alt={user.name ?? ""}
                            width={96}
                            height={96}
                            className="rounded-full object-cover"
                        />
                    )}
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/members/${user.id}/edit`}>수정</Link>
                        </Button>
                        <DeleteButton id={user.id} />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
