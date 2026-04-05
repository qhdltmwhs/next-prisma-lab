import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="max-w-lg mx-auto py-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">페이지를 찾을 수 없어요.</p>
      <Button asChild>
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </main>
  );
}
