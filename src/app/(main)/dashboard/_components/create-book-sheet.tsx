"use client";

import React, { useCallback, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { bookSchema, TBookSchema } from "@/validation/book.validation";
import { fetchCreateBook } from "@/lib/data/book";
import { useRouter } from "next/navigation";

const CreateBookSheet: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<TBookSchema>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      publicationYear: 1999,
      description: "",
    },
  });

  const onSubmit = useCallback(
    (data: TBookSchema) => {
      toast.promise(
        (async () => {
          setIsSubmitting(true);
          try {
            const res = await fetchCreateBook(data);

            if (!res.status && res.errors && typeof isObjectLike(res.errors)) {
              Object.keys(res.errors).forEach((key) => {
                form.setError(key as keyof TBookSchema, {
                  type: "server",
                  message: res.errors[key as keyof TBookSchema],
                });
              });

              throw new Error(res.message || "Failed to create Book");
            }

            // sukses → reset form
            form.reset();
            router.refresh();
          } catch (error) {
            console.error({ error });
            throw error;
          } finally {
            setIsSubmitting(false);
          }
        })(),
        {
          loading: "Saving Book...",
          success: "Book berhasil disimpan!",
          error: (err) => getErrorMessage(err),
          position: "top-center",
        },
      );
    },
    [form, router],
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size={"sm"}>
          Create Book
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Book</SheetTitle>
          <SheetDescription>
            Create the Book details and save the changes
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
                    <FormLabel>Title Book</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="title..." type="text" />
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

export default CreateBookSheet;
