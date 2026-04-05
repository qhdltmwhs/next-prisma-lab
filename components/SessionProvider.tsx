"use client";

import { createContext, useContext } from "react";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// createContext: 전역으로 공유할 값의 "통로" 생성
// 초기값 null — Provider가 실제 값을 주입하기 전 기본값
const SessionContext = createContext<SessionUser | null>(null);

// Provider: 서버에서 받은 user를 Context에 주입
// children을 감싸면 그 하위 어디서든 useSession()으로 꺼낼 수 있음
export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

// useSession: Context 값을 꺼내는 커스텀 훅
// useContext(SessionContext) 를 직접 쓰는 것보다 import 편하고 가독성 좋음
export function useSession() {
  return useContext(SessionContext);
}
