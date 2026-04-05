"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/app/generated/prisma/client";
import { useMemberList } from "../_hooks/useMemberList";

export default function MemberList({ users }: { users: User[] }) {
  // 로직은 훅에, 이 컴포넌트는 UI만 담당
  const { search, setSearch, filtered, handleDelete, isPending } =
    useMemberList(users);

  return (
    <div>
      <Input
        placeholder="이름으로 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {filtered.map((user) => (
              <li key={user.id} className="flex items-center">
                <Link
                  href={`/members/${user.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors flex-1"
                >
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.name ?? ""}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted-foreground/20 flex items-center justify-center text-sm font-medium">
                      {user.name?.[0]}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      {user.role && (
                        <span className="text-xs text-blue-500 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
                          {user.role}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </Link>
                <div className="px-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(user.id)}
                  >
                    삭제
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
