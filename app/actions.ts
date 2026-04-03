"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

 export async function createUser(_prevState: { error: string }, formData: FormData) {
     const name = formData.get("name") as string;
     const email = formData.get("email") as string;
     const role = formData.get("role") as string;
     const imageUrl = formData.get("imageUrl") as string;

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

    await prisma.user.delete({
        where: { id },
    });

    redirect("/");
}

export async function updateUser(_prevState: { error: string }, formData: FormData) {
    const id = Number(formData.get("id"));
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const imageUrl = formData.get("imageUrl") as string;

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
