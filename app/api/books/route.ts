import { getBooks } from "@/db";

export async function GET() {
  try {
    const books = await getBooks();
    return Response.json(books.map((book) => ({
      id: book.id,
      title: book.title,
      summary: book.summary,
      year: book.year,
      author: book.author,
      available: book.member_name === null,
      loan: book.member_name ? { member: book.member_name, dueDate: book.due_on } : null,
    })));
  } catch {
    return Response.json({ error: "The books list is temporarily unavailable." }, { status: 500 });
  }
}