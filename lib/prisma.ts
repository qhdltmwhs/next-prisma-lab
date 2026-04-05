// npx prisma generate 로 생성된 Prisma Client (타입 자동완성 포함)
import { PrismaClient } from "@/app/generated/prisma/client";
// Prisma 7부터 필수 — PostgreSQL 드라이버 어댑터
import { PrismaPg } from "@prisma/adapter-pg";

// PrismaClient 인스턴스를 생성하는 함수
// - PrismaPg 어댑터를 통해 PostgreSQL에 연결
// - DATABASE_URL은 .env 파일에서 읽어옴
const createPrismaClient = () => {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
};

// globalThis: Node.js 어디서나 접근 가능한 전역 객체
// 여기에 prisma 인스턴스를 저장해두는 슬롯을 만듦
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// 전역에 이미 prisma가 있으면 재사용, 없으면 새로 생성
// ?? 는 null/undefined일 때만 오른쪽을 실행하는 연산자
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// production에서는 서버가 재시작되지 않으므로 캐싱 불필요
// development에서는 코드 변경 시 핫리로드가 발생하는데,
// 매번 새 PrismaClient가 생성되면 DB 연결이 무한히 늘어나는 문제가 생김
// → 전역에 저장해서 핫리로드 후에도 같은 인스턴스를 재사용
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
