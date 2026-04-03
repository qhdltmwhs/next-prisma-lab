"use client";

import { useTransition } from "react";
import { deleteUser } from "@/app/actions";
import { Button } from "@/components/ui/button";

export default function DeleteButton({ id }: { id: number }) {
    const [isPending, startTransition] = useTransition();

    return (
        <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() =>
                startTransition(async () => {
                    const formData = new FormData();
                    formData.set("id", String(id));
                    await deleteUser(formData);
                })
            }
        >
            {isPending ? "삭제 중..." : "삭제"}
        </Button>
    );
}
