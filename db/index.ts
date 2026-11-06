import "server-only";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const globalForPostgres = globalThis as typeof globalThis & {
  librarySql?: ReturnType<typeof postgres>;
};

export const sql =
  globalForPostgres.librarySql ??
  postgres(databaseUrl, {
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idle_timeout: 20,
    connect_timeout: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPostgres.librarySql = sql;
}

export type BookRecord = {
  id: number;
  title: string;
  year: number | null;
  author: string;
  member_name: string | null;
  due_on: string | null;
};

export async function getBooks() {
  return sql<BookRecord[]>`
    select
      books.id,
      books.title,
      books.year,
      authors.name as author,
      members.name as member_name,
      to_char(loans.due_on, 'FMMonth FMDD, YYYY') as due_on
    from books
    join authors on authors.id = books.author_id
    left join loans on loans.book_id = books.id and loans.returned_on is null
    left join members on members.id = loans.member_id
    order by books.title asc
  `;
}