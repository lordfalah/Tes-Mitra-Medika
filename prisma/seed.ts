import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma = globalForPrisma.prisma || new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");
  // Hapus data lama
  await prisma.book.deleteMany();

  const booksData = [
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      publicationYear: 1999,
      description: "A book about best practices in software development.",
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      publicationYear: 2008,
      description: "Guidelines to write clean and maintainable code.",
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      publicationYear: 2009,
      description: "Comprehensive textbook on algorithms and data structures.",
    },
    {
      title: "Design Patterns",
      author: "Erich Gamma",
      publicationYear: 1994,
      description: "Classic book introducing 23 design patterns in software.",
    },
    {
      title: "You Don't Know JS",
      author: "Kyle Simpson",
      publicationYear: 2015,
      description: "Deep dive into the JavaScript language.",
    },
    {
      title: "Refactoring",
      author: "Martin Fowler",
      publicationYear: 2018,
      description: "Improving the design of existing code.",
    },
    {
      title: "The Clean Coder",
      author: "Robert C. Martin",
      publicationYear: 2011,
      description: "Professionalism and ethics for software developers.",
    },
    {
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      publicationYear: 2008,
      description: "Focus on the elegant features of JavaScript.",
    },
    {
      title: "Effective Java",
      author: "Joshua Bloch",
      publicationYear: 2017,
      description: "Best practices and techniques for Java programming.",
    },
    {
      title: "Cracking the Coding Interview",
      author: "Gayle Laakmann McDowell",
      publicationYear: 2015,
      description: "Guide to prepare for coding interviews.",
    },
  ];

  for (const book of booksData) {
    await prisma.book.create({
      data: book,
    });
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
