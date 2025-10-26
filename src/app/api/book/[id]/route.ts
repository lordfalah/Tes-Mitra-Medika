import ActionErrorHandler from "@/lib/action-error-handler";
import { getErrorMessage } from "@/lib/handle-error";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/with-auth";
import { bookSchema } from "@/validation/book.validation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export const PATCH = withAuth(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id: bookId } = await params;
      if (!bookId) {
        return NextResponse.json(
          { status: false, message: "Book ID is required", data: null },
          { status: 400 },
        );
      }

      const existingBook = await prisma.book.findUnique({
        where: { id: bookId },
      });
      if (!existingBook) {
        return NextResponse.json(
          { status: false, message: "Book not found", data: null },
          { status: 404 },
        );
      }

      const body = await req.json();
      const parsed = bookSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(ActionErrorHandler.handleZod(parsed.error), {
          status: 400,
        });
      }

      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: parsed.data,
      });

      return NextResponse.json(
        {
          status: true,
          message: "Book updated successfully",
          data: updatedBook,
        },
        { status: 200 },
      );
    } catch (error) {
      // Log error sesuai jenisnya
      if (error instanceof PrismaClientKnownRequestError) {
        console.error(ActionErrorHandler.handlePrisma(error));
      } else {
        console.error(ActionErrorHandler.handleDefault(error));
      }

      return NextResponse.json(
        {
          status: false,
          message: getErrorMessage(error),
          data: null,
        },
        { status: 500 },
      );
    }
  },
) as never;
