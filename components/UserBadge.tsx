"use client";

import { useSession } from "./SessionProvider";

// prop 없이 useSession()만으로 로그인 유저 이름 표시
// prop drilling 없이 어느 컴포넌트에서든 바로 사용 가능
export default function UserBadge() {
  const user = useSession();
  if (!user?.name) return null;
  return <span className="text-sm text-muted-foreground">{user.name}</span>;
}
