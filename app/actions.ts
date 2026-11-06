"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/db";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function addBook(_previousState: { error?: string; success?: string }, formData: FormData) {
  const title = readText(formData, "title");
  const author = readText(formData, "author");
  const yearText = readText(formData, "year");
  const year = Number(yearText);

  if (!title) return { error: "Please enter a book title." };
  if (!author) return { error: "Please enter an author." };
  if (!/^\d{1,4}$/.test(yearText) || year < 1 || year > new Date().getFullYear()) {
    return { error: "Enter a valid publication year." };
  }

  await sql.begin(async (transaction) => {
    const [existingAuthor] = await transaction<{ id: number }[]>`
      select id from authors where lower(name) = lower(${author}) limit 1
    `;
    const [savedAuthor] = existingAuthor
      ? [existingAuthor]
      : await transaction<{ id: number }[]>`
          insert into authors (name) values (${author}) returning id
        `;

    await transaction`
      insert into books (title, year, author_id)
      values (${title}, ${year}, ${savedAuthor.id})
    `;
  });

  revalidatePath("/");
  return { success: `“${title}” was added to the collection.` };
}