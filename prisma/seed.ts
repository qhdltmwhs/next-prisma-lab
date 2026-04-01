import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const members = [
    { name: "Minji",    email: "minji@newjeans.kr" },
    { name: "Hanni",    email: "hanni@newjeans.kr" },
    { name: "Danielle", email: "danielle@newjeans.kr" },
    { name: "Haerin",   email: "haerin@newjeans.kr" },
    { name: "Hyein",    email: "hyein@newjeans.kr" },
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
