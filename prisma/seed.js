const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com", password: hashedPassword },
      { name: "Bob", email: "bob@example.com", password: hashedPassword },
      {
        name: "Charlie",
        email: "charlie@example.com",
        password: hashedPassword,
      },
    ],
  });

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
