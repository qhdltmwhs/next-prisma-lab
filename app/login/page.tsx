import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <main className="max-w-sm mx-auto py-20 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>로그인</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        action={async () => {
                            "use server";
                            await signIn("github", { redirectTo: "/" });
                        }}
                    >
                        <Button type="submit" className="w-full">
                            GitHub로 로그인
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
