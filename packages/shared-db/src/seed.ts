import { prisma } from "./client";

async function main() {
  console.log("Seeding database foundation...");
  const count = await prisma.user.count();
  console.log(`Total users in dragon_db: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
