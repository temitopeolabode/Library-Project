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

export async function updateBook(_previousState: { error?: string; success?: string }, formData: FormData) {
  const id = Number(readText(formData, "id"));
  const title = readText(formData, "title");
  const author = readText(formData, "author");
  const yearText = readText(formData, "year");
  const year = Number(yearText);

  if (!Number.isInteger(id) || id < 1) return { error: "That book could not be found." };
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
      update books set title = ${title}, year = ${year}, author_id = ${savedAuthor.id}
      where id = ${id}
    `;
  });

  revalidatePath("/");
  return { success: "Book details updated." };
}

export async function deleteBook(_previousState: { error?: string; success?: string }, formData: FormData) {
  const id = Number(readText(formData, "id"));
  if (!Number.isInteger(id) || id < 1) return { error: "That book could not be found." };

  const [book] = await sql<{ title: string }[]>`
    select title from books where id = ${id}
  `;
  if (!book) return { error: "That book could not be found." };

  const [activeLoan] = await sql<{ id: number }[]>`
    select id from loans where book_id = ${id} and returned_on is null limit 1
  `;
  if (activeLoan) return { error: "This book is on loan. Record its return before deleting it." };

  await sql`delete from books where id = ${id}`;
  revalidatePath("/");
  return { success: `“${book.title}” was removed.` };
}

export async function addMember(_previousState: { error?: string; success?: string }, formData: FormData) {
  const name = readText(formData, "name");
  const phone = readText(formData, "phone");

  if (!name) return { error: "Please enter a member name." };
  if (name.length > 160) return { error: "A member name must be 160 characters or fewer." };
  if (phone.length > 40) return { error: "A phone number must be 40 characters or fewer." };

  await sql`insert into members (name, phone) values (${name}, ${phone || null})`;
  revalidatePath("/members");
  return { success: `${name} was added as a member.` };
}

export async function deleteMember(_previousState: { error?: string; success?: string }, formData: FormData): Promise<{ error?: string; success?: string }> {
  const id = Number(readText(formData, "id"));
  if (!Number.isInteger(id) || id < 1) return { error: "That member could not be found." };

  const result = await sql.begin(async (transaction) => {
    const [member] = await transaction<{ id: number; name: string }[]>`
      select id, name from members where id = ${id} for update
    `;
    if (!member) return { error: "That member could not be found." };

    const [loan] = await transaction<{ id: number }[]>`
      select id from loans where member_id = ${id} limit 1
    `;
    if (loan) return { error: `${member.name} has loan history and cannot be removed.` };

    await transaction`delete from members where id = ${id}`;
    return { success: `${member.name} was removed from the members list.` };
  });

  if (result.success) revalidatePath("/members");
  return result;
}

export async function lendBook(_previousState: { error?: string; success?: string }, formData: FormData) {
  const bookId = Number(readText(formData, "book_id"));
  const memberId = Number(readText(formData, "member_id"));
  const days = Number(readText(formData, "days"));
  if (!Number.isInteger(bookId) || bookId < 1) return { error: "Choose an available book." };
  if (!Number.isInteger(memberId) || memberId < 1) return { error: "Choose a member." };
  if (![7, 14, 21, 30].includes(days)) return { error: "Choose a loan length of 7, 14, 21, or 30 days." };

  try {
    const [book] = await sql.begin(async (transaction) => {
      const [availableBook] = await transaction<{ title: string }[]>`
        select title from books where id = ${bookId} for update
      `;
      if (!availableBook) throw new Error("This book is not available.");

      const [activeLoan] = await transaction<{ id: number }[]>`
        select id from loans where book_id = ${bookId} and returned_on is null
      `;
      if (activeLoan) throw new Error("This book is already on loan.");

      const [member] = await transaction<{ id: number }[]>`
        select id from members where id = ${memberId}
      `;
      if (!member) throw new Error("Choose a valid member.");

      await transaction`
        insert into loans (book_id, member_id, borrowed_on, due_on)
        values (${bookId}, ${memberId}, current_date, current_date + ${days}::int)
      `;
      return [availableBook];
    });
    revalidatePath("/");
    return { success: `“${book.title}” is now on loan for ${days} days.` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to lend this book." };
  }
}

export async function returnBook(_previousState: { error?: string; success?: string }, formData: FormData) {
  const bookId = Number(readText(formData, "book_id"));
  if (!Number.isInteger(bookId) || bookId < 1) return { error: "That book could not be found." };

  const [returned] = await sql<{ title: string }[]>`
    update loans set returned_on = current_date
    where book_id = ${bookId} and returned_on is null
    returning (select title from books where books.id = loans.book_id) as title
  `;
  if (!returned) return { error: "This book is not currently on loan." };

  revalidatePath("/");
  return { success: `“${returned.title}” has been returned.` };
}