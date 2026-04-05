import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import MemberList from "./members/_components/MemberList";
import UserBadge from "@/components/UserBadge";

const PAGE_SIZE = 5;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { sort, page: pageParam } = await searchParams;

  // page 파라미터가 없거나 1보다 작으면 1로 고정
  const currentPage = Math.max(1, Number(pageParam ?? 1));

  // Promise.all: 두 쿼리를 동시에 실행 (순차 실행보다 빠름)
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: sort === "name" ? { name: "asc" } : { id: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE, // 앞 페이지 건너뜀
      take: PAGE_SIZE, // 이번 페이지 분량만 가져옴
    }),
    prisma.user.count(), // 전체 수 (총 페이지 계산용)
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // sort 파라미터를 유지하면서 page만 바꾸는 URL 생성
  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    params.set("page", String(p));
    return `/?${params}`;
  }

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
        <UserBadge />
      </div>
      <div className="flex gap-2 mb-4">
        <Button
          asChild
          variant={sort === "name" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/?sort=name">이름순</Link>
        </Button>
        <Button asChild variant={!sort ? "default" : "outline"} size="sm">
          <Link href="/">등록순</Link>
        </Button>
      </div>
      <MemberList users={users} />
      {/* 페이지네이션 UI */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {currentPage > 1 ? (
          <Button asChild variant="outline" size="sm">
            <Link href={pageUrl(currentPage - 1)}>이전</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            이전
          </Button>
        )}
        <span className="text-sm text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        {currentPage < totalPages ? (
          <Button asChild variant="outline" size="sm">
            <Link href={pageUrl(currentPage + 1)}>다음</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            다음
          </Button>
        )}
      </div>
    </main>
  );
}
