"use client"; // ← useState 쓰려면 클라이언트 컴포넌트여야 함

import { useState, useActionState } from "react";
import { createUser, updateUser } from "@/app/actions";

type User = {
    id: number;
    name: string | null;
    email: string;
};

type Props = {
    user?: User; // 있으면 수정, 없으면 추가
};

export default function MemberForm({ user }: Props) {
    const isEdit = !!user; // user가 있으면 수정 모드

    const [state, formAction, isPending] = useActionState(
        isEdit ? updateUser : createUser, 
        { error: "" }
    );

    const [name, setName] = useState(user?.name ?? "");
    const nameError = name.trim() === "" ? "이름은 필수입니다" : "";

    return (
        <form action={formAction}>
            {isEdit && <input type="hidden" name="id" value={user.id} />}
            <div>
                <label>이름</label>
                <input
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {nameError && <p style={{ color: "red" }}>{nameError}</p>}
            </div>
            <div>
                <label>이메일</label>
                <input name="email" type="email" defaultValue={user?.email ?? ""} />
            </div>
            {state.error && <p style={{ color: "red" }}>{state.error}</p>}
            <button type="submit" disabled={!!nameError || isPending}>
                {isPending ? "처리 중..." : isEdit ? "저장" : "추가"}
            </button>
        </form>
    );
}
