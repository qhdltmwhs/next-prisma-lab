import { prisma } from "@/lib/prisma";
import MemberForm from "@/app/members/_components/MemberForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    });

    if (!user) return <p>멤버를 찾을 수 없어요.</p>;

    return (
        <main className="max-w-lg mx-auto py-10 px-4">
            <div className="mb-4">
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/members/${id}`}>← 돌아가기</Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{user.name} 수정</CardTitle>
                </CardHeader>
                <CardContent>
                    <MemberForm user={user} />
                </CardContent>
            </Card>
        </main>
    );
}
