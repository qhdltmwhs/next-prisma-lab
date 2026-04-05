import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const members = [
    { name: "Minji",    email: "minji@newjeans.kr",    role: "리더", imageUrl: "https://picsum.photos/201" },
    { name: "Hanni",    email: "hanni@newjeans.kr",    role: "댄서", imageUrl: "https://picsum.photos/202" },
    { name: "Danielle", email: "danielle@newjeans.kr", role: "보컬", imageUrl: "https://picsum.photos/203" },
    { name: "Haerin",   email: "haerin@newjeans.kr",   role: "댄서", imageUrl: "https://picsum.photos/204" },
    { name: "Hyein",    email: "hyein@newjeans.kr",    role: "보컬", imageUrl: "https://picsum.photos/205" },
    { name: "Heejin",   email: "heejin@newjeans.kr",   role: "대표", imageUrl: "https://picsum.photos/200" },
  ];

  for (const member of members) {
    await prisma.user.upsert({
      where:  { email: member.email },
      update: {},
      create: member,
    });
  }

  console.log("Seeded NewJeans members!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
