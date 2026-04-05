"use client"

import { useReducer, useActionState, useCallback } from "react";
import { createUser, updateUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/app/generated/prisma/client";

// 폼 전체 상태를 하나의 타입으로 정의
type FormState = {
    name: string;
    email: string;
    role: string;
    imageUrl: string;
};

// 어떤 액션이 가능한지 타입으로 명시
// SET_FIELD: 특정 필드의 값을 바꿈
type Action = { type: "SET_FIELD"; field: keyof FormState; value: string };

// reducer: (현재 상태, 액션) → 새 상태
// switch로 액션 종류마다 다른 처리
function reducer(state: FormState, action: Action): FormState {
    switch (action.type) {
        case "SET_FIELD":
            // [action.field]: 계산된 프로퍼티명 — 어떤 필드든 하나로 처리
            return { ...state, [action.field]: action.value };
    }
}

type Props = {
    user?: User;
};

export default function MemberForm({ user }: Props) {
    const isEdit = !!user;

    const [state, formAction, isPending] = useActionState(
        isEdit ? updateUser : createUser,
        { error: "" }
    );

    // useReducer: useState 여러 개 대신 하나의 reducer로 폼 상태 통합 관리
    // useState였다면: const [name, setName] = useState(...) x4
    const [fields, dispatch] = useReducer(reducer, {
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "",
        imageUrl: user?.imageUrl ?? "",
    });

    // 유효성 검사: 렌더링할 때마다 계산 (파생 상태)
    const nameError = fields.name.trim() === "" ? "이름은 필수입니다" : "";
    const emailError = fields.email && !fields.email.includes("@") ? "올바른 이메일을 입력하세요" : "";
    const hasError = !!nameError || !!emailError;

    // useCallback: dispatch는 React가 안정성 보장 → deps []
    // handleChange 자체가 안정적이어야 Input에 넘길 때 불필요한 리렌더 방지
    const handleChange = useCallback((field: keyof FormState) => {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch({ type: "SET_FIELD", field, value: e.target.value });
    }, []);

    return (
        <form action={formAction} className="space-y-4">
            {isEdit && <input type="hidden" name="id" value={user.id} />}
            <div className="space-y-1">
                <Label htmlFor="name">이름</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={fields.name}
                    onChange={handleChange("name")}
                />
                {nameError && <p className="text-sm text-red-500">{nameError}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="email">이메일</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={fields.email}
                    onChange={handleChange("email")}
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="role">역할</Label>
                <Input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="예: 보컬, 댄서, 래퍼"
                    value={fields.role}
                    onChange={handleChange("role")}
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="imageUrl">프로필 이미지 URL</Label>
                <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    placeholder="https://..."
                    value={fields.imageUrl}
                    onChange={handleChange("imageUrl")}
                />
            </div>
            {state.error && <p className="text-sm text-red-500">{state.error}</p>}
            <Button type="submit" disabled={hasError || isPending} className="w-full">
                {isPending ? "처리 중..." : isEdit ? "저장" : "추가"}
            </Button>
        </form>
    );
}
