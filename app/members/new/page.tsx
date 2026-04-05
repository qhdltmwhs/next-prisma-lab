import MemberForm from "@/app/members/_components/MemberForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewMemberPage() {
  return (
    <main className="max-w-lg mx-auto py-10 px-4">
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">← 목록으로</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>멤버 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberForm />
        </CardContent>
      </Card>
    </main>
  );
}
