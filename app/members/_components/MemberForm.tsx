"use client"

import { useState, useActionState } from "react";
import { createUser, updateUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "@/app/generated/prisma/client";

type Props = {
    user?: User;
};

export default function MemberForm({ user }: Props) {
    const isEdit = !!user;

    const [state, formAction, isPending] = useActionState(
        isEdit ? updateUser : createUser,
        { error: "" }
    );

    const [name, setName] = useState(user?.name ?? "");
    const nameError = name.trim() === "" ? "이름은 필수입니다" : "";

    return (
        <form action={formAction} className="space-y-4">
            {isEdit && <input type="hidden" name="id" value={user.id} />}
            <div className="space-y-1">
                <Label htmlFor="name">이름</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {nameError && <p className="text-sm text-red-500">{nameError}</p>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" name="email" type="email" defaultValue={user?.email ?? ""} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="role">역할</Label>
                <Input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="예: 보컬, 댄서, 래퍼"
                    defaultValue={user?.role ?? ""}
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="imageUrl">프로필 이미지 URL</Label>
                <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="text"
                    placeholder="https://..."
                    defaultValue={user?.imageUrl ?? ""}
                />
            </div>
            {state.error && <p className="text-sm text-red-500">{state.error}</p>}
            <Button type="submit" disabled={!!nameError || isPending} className="w-full">
                {isPending ? "처리 중..." : isEdit ? "저장" : "추가"}
            </Button>
        </form>
    );
}
