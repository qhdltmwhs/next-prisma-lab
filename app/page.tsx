// app/page.tsx (서버 컴포넌트)
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const users = await prisma.user.findMany();
  
  return (
      <main>
          <h1>NewJeans</h1>
          <Link href="/members/new">+ 멤버 추가</Link>
          <ul>
              {users.map((user) => (
                  <li key={user.id}>
                      <Link href={`/members/${user.id}`}>{user.name}</Link>
                  </li>
              ))}
          </ul>
      </main>
  );
}
