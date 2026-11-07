import { BookOpen, CircleCheck, Clock3 } from "lucide-react";
import type { BookRecord } from "@/db";
import { BookControls } from "./book-controls";
import { ReturnBookButton } from "./loan-controls";

export function BookList({ books, controls = true }: { books: BookRecord[]; controls?: boolean }) {
  if (books.length === 0) {
    return <div className="empty-state"><BookOpen size={26} strokeWidth={1.5} /><p>No books by this author yet.</p></div>;
  }

  return (
    <div className="book-list">
      {books.map((book, index) => (
        <article className="book-row" key={book.id}>
          <div className={`book-cover cover-${index % 5}`} aria-hidden="true"><span>{book.title.slice(0, 1)}</span><i /></div>
          <div className="book-details">
            <h2>{book.title}</h2>
            <p>{book.author}{book.year ? <span className="book-year"> · {book.year}</span> : null}</p>
          </div>
          <div className="book-status">
            {book.member_name ? (
              <><span className="status-pill on-loan"><Clock3 size={13} /> On loan</span><p>To {book.member_name}{book.due_on ? ` · Due ${book.due_on}` : ""}</p></>
            ) : (
              <><span className="status-pill available"><CircleCheck size={13} /> Available</span><p>On the shelf</p></>
            )}
          </div>
          <div className="book-row-end">
            <div className="book-number">{String(index + 1).padStart(2, "0")}</div>
            {controls ? <BookControls book={book} /> : null}
            {controls && book.member_name ? <ReturnBookButton bookId={book.id} title={book.title} /> : null}
          </div>
        </article>
      ))}
    </div>
  );
}