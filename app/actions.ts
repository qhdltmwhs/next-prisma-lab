"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UserSchema = z.object({
    name: z.string().min(1, "이름은 필수입니다"),
    email: z.string().email("올바른 이메일을 입력하세요"),
    role: z.string().optional(),
    imageUrl: z.string().url("올바른 URL을 입력하세요").optional().or(z.literal("")),
});

export async function createUser(_prevState: { error: string }, formData: FormData) {
    const raw = {
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role") || undefined,
        imageUrl: formData.get("imageUrl") || undefined,
    };

    const result = UserSchema.safeParse(raw);

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        const first = Object.values(errors)[0]?.[0];
        return { error: first ?? "입력값을 확인해주세요" };
    }

    const { name, email, role, imageUrl } = result.data;

    try {
        await prisma.user.create({
            data: { name, email, role, imageUrl },
        });
    } catch {
        return { error: "이미 사용 중인 이메일입니다." };
    }

    redirect("/");
}

export async function deleteUser(formData: FormData) {
    const id = Number(formData.get("id"));

    try {
        await prisma.user.delete({ where: { id } });
    } catch {
        return; // optimistic UI가 이미 처리 — 조용히 실패
    }

    revalidatePath("/"); // full navigation 없이 목록만 갱신
}

export async function updateUser(_prevState: { error: string }, formData: FormData) {
    const id = Number(formData.get("id"));

    const raw = {
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role") || undefined,
        imageUrl: formData.get("imageUrl") || undefined,
    };

    const result = UserSchema.safeParse(raw);

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        const first = Object.values(errors)[0]?.[0];
        return { error: first ?? "입력값을 확인해주세요" };
    }

    const { name, email, role, imageUrl } = result.data;

    try {
        await prisma.user.update({
            where: { id },
            data: { name, email, role, imageUrl },
        });
    } catch {
        return { error: "이미 사용 중인 이메일입니다." };
    }

    redirect(`/members/${id}`);
}
