import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // template: 각 페이지에서 title을 지정하면 " | 멤버 관리" 가 자동으로 붙음
  // default: title을 지정하지 않은 페이지의 기본값
  title: {
    template: "%s | 멤버 관리",
    default: "멤버 관리",
  },
  description: "뉴진스 멤버 관리 앱",
};

// async: 서버 컴포넌트는 await 사용 가능
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 세션 한 번만 fetch → SessionProvider로 전달
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Provider로 감싸면 children 어디서든 useSession()으로 접근 가능 */}
        <SessionProvider user={session?.user ?? null}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
