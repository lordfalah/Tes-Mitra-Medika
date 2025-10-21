"use server";

import { cookies } from "next/headers";
import { GetBookSchema } from "../search-params/search-book";
import { TActionResult, TApiResult } from "@/types/action.type";
import { Book } from "@prisma/client";
import { TBookSchema } from "@/validation/book.validation";
import { getErrorMessage } from "../handle-error";

export const fetchBooks = async (
  input: GetBookSchema,
): Promise<TApiResult<Omit<Book[], "updatedAt">>> => {
  const cookie = await cookies();
  try {
    const params = new URLSearchParams({
      ...input,
      sort: JSON.stringify(input.sort),
    } as never);

    const req = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/book?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Cookie: cookie.toString(),
        },
        cache: "no-store",
      },
    );
    const res = await req.json();
    return res;
  } catch (error) {
    throw error;
  }
};

export const fetchUpdateBook = async (
  id: string,
  payload: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>,
): Promise<TActionResult<Book>> => {
  const cookie = await cookies();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/book/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: false,
        message: result?.message || "Failed to update book",
        errors: result?.errors || null,
      };
    }

    return {
      status: true,
      message: result?.message || "Book updated successfully",
      data: result?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchCreateBook = async (
  payload: TBookSchema,
): Promise<TActionResult<Book>> => {
  const cookie = await cookies();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/book`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify(payload),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        status: false,
        message: result?.message || "Failed to create book",
        errors: result?.errors || null,
      };
    }

    return {
      status: true,
      message: result?.message || "Book created successfully",
      data: result?.data,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchDeleteBooks = async ({
  ids,
}: {
  ids: string[];
}): Promise<{ status: boolean; data: number; message: string }> => {
  const cookie = await cookies();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/book`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.toString(),
        },
        body: JSON.stringify({ ids }),
      },
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return {
      status: false,
      data: 0,
      message: getErrorMessage(error),
    };
  }
};
