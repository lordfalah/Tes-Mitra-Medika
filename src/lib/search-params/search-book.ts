import { getSortingStateParser } from "../parsers";
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
  createLoader,
} from "nuqs/server";

import { Book } from "@prisma/client";

export const bluePrintBookSearch = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<Book>().withDefault([
    { id: "createdAt", desc: true },
  ]),
  title: parseAsString.withDefault(""),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
};

export const searchParamsCacheBook =
  createSearchParamsCache(bluePrintBookSearch);
export const loadSearchParamsBook = createLoader(bluePrintBookSearch);

export type GetBookSchema = Awaited<
  ReturnType<typeof searchParamsCacheBook.parse>
>;
