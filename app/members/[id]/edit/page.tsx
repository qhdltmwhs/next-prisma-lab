import { prisma } from "@/lib/prisma";
import MemberForm from "@/app/members/_components/MemberForm";

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    });

    if (!user) return <p>멤버를 찾을 수 없어요.</p>;

    return (
        <main>
            <h1>{user.name} 수정</h1>
            <MemberForm user={user} />
        </main>
    );
}
