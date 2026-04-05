import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import DeleteButton from "../_components/DeleteButton";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// generateMetadata: 페이지와 동일한 params를 받아서 Metadata 반환
// Next.js가 <head>에 자동으로 주입함 (서버에서 실행)
// DB 조회가 페이지 컴포넌트와 중복되어도 Next.js가 요청을 자동으로 캐싱(메모이제이션)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  return {
    title: user?.name ?? "멤버 없음",
    // layout의 template이 적용되어 "Minji | 멤버 관리" 형태가 됨
  };
}

export default async function MemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
