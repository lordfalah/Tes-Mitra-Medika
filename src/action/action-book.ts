"use server";

import { Book, Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

import { after, connection } from "next/server";
import { GetBookSchema } from "@/lib/search-params/search-book";
import { getErrorMessage } from "@/lib/handle-error";
import { revalidatePath } from "next/cache";
import { TActionResult } from "@/types/action.type";
import { bookSchema } from "@/validation/book.validation";
import ActionErrorHandler from "@/lib/action-error-handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export type TGetBooksWithFilters = Awaited<
  ReturnType<typeof getBooksWithFilters>
>["data"]["data"][number];

export async function getBooksWithFilters(input: GetBookSchema) {
  await connection();

  try {
    const { page, perPage, sort, title, createdAt } = input;
    const skip = (page - 1) * perPage;

    const orderBy = sort.length
      ? sort.map(({ id, desc }) => ({ [id]: desc ? "desc" : "asc" }))
      : [{ createdAt: "desc" }];

    // filter
    const where: Prisma.BookWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: "insensitive",
        },
      }),

      ...(createdAt.length === 2 && {
        createdAt: {
          gte: new Date(createdAt[0]),
          lte: new Date(createdAt[1]),
        },
      }),
    };

    const [data, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        skip,
        take: perPage,
        select: {
          id: true,
          title: true,
          author: true,
          publicationYear: true,
          description: true,
          createdAt: true,
        },
      }),
      prisma.book.count({ where }),
    ]);

    return {
      status: true,
      message: "Books fetched successfully",
      data: { data, total, page, perPage },
    };
  } catch (err) {
    return {
      status: false,
      message: getErrorMessage(err) || "Failed to fetch books",
      data: { data: [], total: 0, page: 0, perPage: 0 },
    };
  }
}

export async function deleteBooks({ ids }: { ids: string[] }) {
  try {
    const books = await prisma.book.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    revalidatePath("/dashboard");
    return {
      data: books,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: getErrorMessage(error),
    };
  }
}

export async function createBookAction(
  formData: unknown,
): Promise<TActionResult<Book>> {
  try {
    // 🔍 Validasi dengan Zod
    const parsed = bookSchema.safeParse(formData);

    if (!parsed.success) {
      return ActionErrorHandler.handleZod(parsed.error);
    }

    // 💾 Simpan ke database dengan Prisma
    const product = await prisma.book.create({
      data: {
        ...parsed.data,
      },
    });

    return {
      status: true,
      message: "Book berhasil dibuat",
      data: product,
    };
  } catch (error) {
    after(() => {
      if (error instanceof PrismaClientKnownRequestError) {
        // Prisma error
        console.error(ActionErrorHandler.handlePrisma(error));
      } else {
        // Default handler
        console.error(ActionErrorHandler.handleDefault(error));
      }
    });

    return {
      status: false,
      errors: null,
      message: getErrorMessage(error),
    };
  }
}

export async function updateBookAction(
  id: string,
  formData: unknown,
): Promise<TActionResult<Book>> {
  try {
    const parsed = bookSchema.partial().safeParse(formData);

    if (!parsed.success) {
      return ActionErrorHandler.handleZod(parsed.error);
    }

    const book = await prisma.book.update({
      where: { id },
      data: {
        ...parsed.data,
      },
    });

    revalidatePath("/dashboard");

    return {
      status: true,
      message: "Book berhasil diperbarui",
      data: book,
    };
  } catch (error) {
    after(() => {
      if (error instanceof PrismaClientKnownRequestError) {
        // Prisma error
        console.error(ActionErrorHandler.handlePrisma(error));
      } else {
        // Default handler
        console.error(ActionErrorHandler.handleDefault(error));
      }
    });

    return {
      status: false,
      errors: null,
      message: getErrorMessage(error),
    };
  }
}
