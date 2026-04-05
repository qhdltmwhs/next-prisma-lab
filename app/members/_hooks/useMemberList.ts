import { useState, useOptimistic, useTransition, useMemo, useCallback } from "react";
import { deleteUser } from "@/app/actions";
import type { User } from "@/app/generated/prisma/client";

export function useMemberList(users: User[]) {
    const [search, setSearch] = useState("");

    const [optimisticUsers, deleteOptimistic] = useOptimistic(
        users,
        (state: User[], deletedId: number) =>
            state.filter((u) => u.id !== deletedId),
    );

    const [isPending, startTransition] = useTransition();

    // useCallback: 함수를 메모이제이션 — 의존값이 바뀔 때만 새 함수 생성
    // deps 없음([]) → 마운트 시 한 번만 생성, 이후 항상 같은 참조
    // deleteOptimistic, startTransition 은 React가 안정성 보장 → deps 생략 가능
    const handleDelete = useCallback((id: number) => {
        startTransition(async () => {
            deleteOptimistic(id);
            const formData = new FormData();
            formData.set("id", String(id));
            await deleteUser(formData);
        });
    }, [deleteOptimistic]);

    // useMemo: 계산 결과를 메모이제이션 — 의존값이 바뀔 때만 재계산
    // optimisticUsers 또는 search 가 바뀔 때만 filter 재실행
    const filtered = useMemo(
        () => optimisticUsers.filter((user) =>
            user.name?.toLowerCase().includes(search.toLowerCase()),
        ),
        [optimisticUsers, search],
    );

    return { search, setSearch, filtered, handleDelete, isPending };
}
