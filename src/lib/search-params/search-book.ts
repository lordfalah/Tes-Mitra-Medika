import { getSortingStateParser } from "../parsers";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from "nuqs/server";

import { Book } from "@prisma/client";

export const searchParamsCacheBook = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Book>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  price: parseAsInteger,
  title: parseAsString.withDefault(""),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
});

export type GetBookSchema = Awaited<
  ReturnType<typeof searchParamsCacheBook.parse>
>;
