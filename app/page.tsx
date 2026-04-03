import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import MemberList from "./members/_components/MemberList";

export default async function Page({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
    const session = await auth();
    const { sort } = await searchParams;

    const users = await prisma.user.findMany({
        orderBy: sort === "name" ? { name: "asc" } : { id: "asc" },
    });

    return (
        <main className="max-w-xl mx-auto py-10 px-4">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">NewJeans</h1>
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm">
                            <Link href="/members/new">+ 멤버 추가</Link>
                        </Button>
                        <form
                            action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/login" });
                            }}
                        >
                            <Button variant="outline" size="sm" type="submit">
                                로그아웃
                            </Button>
                        </form>
                    </div>
                </div>
                <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
            </div>
            <div className="flex gap-2 mb-4">
                <Button asChild variant={sort === "name" ? "default" : "outline"} size="sm">
                    <Link href="/?sort=name">이름순</Link>
                </Button>
                <Button asChild variant={!sort ? "default" : "outline"} size="sm">
                    <Link href="/">등록순</Link>
                </Button>
            </div>
            <MemberList users={users} />
        </main>
    );
}
