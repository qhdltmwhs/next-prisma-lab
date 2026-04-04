import { useState, useOptimistic, useTransition } from "react";
import { deleteUser } from "@/app/actions";
import type { User } from "@/app/generated/prisma/client";

// Custom Hook: "use" 접두사로 시작해야 React가 훅으로 인식
// 내부에서 다른 훅(useState, useOptimistic, useTransition)을 자유롭게 호출 가능
// → 로직만 추출, UI는 없음 (JSX 반환 X)
export function useMemberList(users: User[]) {
    const [search, setSearch] = useState("");

    const [optimisticUsers, deleteOptimistic] = useOptimistic(
        users,
        (state: User[], deletedId: number) =>
            state.filter((u) => u.id !== deletedId),
    );

    const [isPending, startTransition] = useTransition();

    function handleDelete(id: number) {
        startTransition(async () => {
            deleteOptimistic(id);
            const formData = new FormData();
            formData.set("id", String(id));
            await deleteUser(formData);
        });
    }

    // 검색 필터링: 파생 상태 (별도 state 불필요)
    const filtered = optimisticUsers.filter((user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()),
    );

    // 컴포넌트에서 필요한 것만 반환
    return { search, setSearch, filtered, handleDelete, isPending };
}
