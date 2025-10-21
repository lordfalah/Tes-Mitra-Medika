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
    // tambahan 10 lagi
    {
      title: "Code Complete",
      author: "Steve McConnell",
      publicationYear: 2004,
      description:
        "Comprehensive guide to software construction and craftsmanship.",
    },
    {
      title: "The Mythical Man-Month",
      author: "Frederick P. Brooks Jr.",
      publicationYear: 1975,
      description: "Essays on software engineering and project management.",
    },
    {
      title: "Continuous Delivery",
      author: "Jez Humble",
      publicationYear: 2010,
      description: "Principles and practices for building deployable software.",
    },
    {
      title: "Domain-Driven Design",
      author: "Eric Evans",
      publicationYear: 2003,
      description: "Tackling complex software design using domain modeling.",
    },
    {
      title: "The Art of Computer Programming",
      author: "Donald E. Knuth",
      publicationYear: 2011,
      description:
        "Comprehensive volumes covering algorithms and programming theory.",
    },
    {
      title: "The Phoenix Project",
      author: "Gene Kim",
      publicationYear: 2013,
      description: "A novel about IT, DevOps, and helping your business win.",
    },
    {
      title: "Accelerate",
      author: "Nicole Forsgren",
      publicationYear: 2018,
      description:
        "Building and scaling high-performing technology organizations.",
    },
    {
      title: "Soft Skills: The software developer's life manual",
      author: "John Sonmez",
      publicationYear: 2014,
      description:
        "Guidance on career, productivity, and personal development for developers.",
    },
    {
      title: "Algorithms to Live By",
      author: "Brian Christian",
      publicationYear: 2016,
      description:
        "Applying computer science algorithms to everyday human decisions.",
    },
    {
      title: "Clean Architecture",
      author: "Robert C. Martin",
      publicationYear: 2017,
      description:
        "A guide to creating robust and maintainable software architectures.",
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
