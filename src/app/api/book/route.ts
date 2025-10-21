import ActionErrorHandler from "@/lib/action-error-handler";
import { getServerSession } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/handle-error";
import prisma from "@/lib/prisma";
import { loadSearchParamsBook } from "@/lib/search-params/search-book";
import { bookSchema } from "@/validation/book.validation";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json(
      { status: false, message: "Unauthorized access", data: [] },
      { status: 401 },
    );
  }

  try {
    const { createdAt, page, perPage, title, sort } = loadSearchParamsBook(req);

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

    return NextResponse.json(
      {
        status: true,
        message: "Books fetched successfully",
        data: { data, total, page, perPage },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({
      status: false,
      errors: null,
      message: getErrorMessage(error),
    });
  }
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session) {
    NextResponse.json(
      {
        status: false,
        errors: null,
        message: "Unauthorized access",
      },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const parsed = bookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(ActionErrorHandler.handleZod(parsed.error), {
        status: 400,
      });
    }

    const product = await prisma.book.create({
      data: {
        ...parsed.data,
      },
    });

    return NextResponse.json({
      status: true,
      message: "Book berhasil dibuat",
      data: product,
    });
  } catch (error) {
    // Log error sesuai jenisnya
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(ActionErrorHandler.handlePrisma(error));
    } else {
      console.error(ActionErrorHandler.handleDefault(error));
    }

    return NextResponse.json({
      status: false,
      errors: null,
      message: getErrorMessage(error),
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  const session = await getServerSession();
  if (!session) {
    NextResponse.json(
      {
        status: false,
        data: 0,
        message: "Unauthorized access",
      },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { ids } = body as { ids: string[] };

    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { status: false, message: "No book IDs provided", data: 0 },
        { status: 400 },
      );
    }

    const result = await prisma.book.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return NextResponse.json(
      {
        status: true,
        message: `Deleted ${result.count} book(s) successfully`,
        data: result.count,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: false,
      data: 0,
      message: getErrorMessage(error),
    });
  }
};
