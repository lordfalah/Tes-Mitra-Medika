"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/handle-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { isObjectLike } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { TGetBooksWithFilters, updateBookAction } from "@/action/action-book";
import { bookSchema, TBookSchema } from "@/validation/book.validation";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";

interface UpdateBookSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  book: TGetBooksWithFilters | null;
}

const UpdateBookSheet: React.FC<UpdateBookSheetProps> = ({
  book,
  ...props
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<TBookSchema>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title ?? "",
      description: book?.description ?? "",
      author: book?.author,
      publicationYear: book?.publicationYear,
    },
  });

  useEffect(() => {
    if (book) {
      form.reset({
        title: book?.title ?? "",
        description: book?.description ?? "",
        author: book?.author,
        publicationYear: book?.publicationYear,
      });
    }
  }, [book, form]);

  const onSubmit = useCallback(
    (values: TBookSchema) => {
      toast.promise(
        (async () => {
          setIsSubmitting(true);
          try {
            if (!book?.id) throw new Error("book is required");
            const res = await updateBookAction(book.id, values);

            if (!res.status && res.errors && typeof isObjectLike(res.errors)) {
              Object.keys(res.errors).forEach((key) => {
                form.setError(key as keyof TBookSchema, {
                  type: "server",
                  message: res.errors[key as keyof TBookSchema],
                });
              });

              throw new Error(res.message || "Failed to create book");
            }
            props.onOpenChange?.(false);
          } catch (error) {
            console.error({ error });
            throw error;
          } finally {
            setIsSubmitting(false);
          }
        })(),
        {
          loading: "Saving produk...",
          success: "Produk berhasil diupdate!",
          error: (err) => getErrorMessage(err),
          position: "top-center",
        },
      );
    },
    [form, book?.id, props],
  );

  return (
    <Sheet {...props}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update book</SheetTitle>
          <SheetDescription>
            Update the book details and save the changes
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            className="grid h-full content-between"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel>Title book</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="title..." type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel>Author book</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="author..." type="text" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publicationYear"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel>Publication Year</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="year..."
                        type="number"
                        min={1000}
                        max={9999}
                        step={1}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-2.5">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <AutosizeTextarea
                        placeholder="This textarea with min height 52 and max height 200."
                        maxHeight={200}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="self-end">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <React.Fragment>
                    <Loader2 className="animate-spin" />
                    Please wait
                  </React.Fragment>
                ) : (
                  "Submit"
                )}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default UpdateBookSheet;
