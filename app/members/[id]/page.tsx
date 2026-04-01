import { prisma } from "@/lib/prisma";
import { deleteUser } from "@/app/actions";
import Link from "next/link";

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id: Number(id) },
    });

    if (!user) return <p>멤버를 찾을 수 없어요.</p>;

    return (
        <main>
            <h1>{user.name}</h1>
            <p>{user.email}</p>

            <Link href={`/members/${user.id}/edit`}>수정</Link>

            <form action={deleteUser}>
                <input type="hidden" name="id" value={user.id} />
                <button type="submit">삭제</button>
            </form>
        </main>
    );
}
