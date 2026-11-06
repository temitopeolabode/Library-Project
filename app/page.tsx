import { Suspense } from "react";
import { BookOpen, CircleCheck, Clock3 } from "lucide-react";
import { getBooks, type BookRecord } from "@/db";
import { SideNav } from "./components/side-nav";

function BookRows({ books }: { books: BookRecord[] }) {
  if (books.length === 0) {
    return <div className="empty-state"><BookOpen size={26} strokeWidth={1.5} /><p>No books in the collection yet.</p></div>;
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
          <div className="book-number">{String(index + 1).padStart(2, "0")}</div>
        </article>
      ))}
    </div>
  );
}

async function BooksContent() {
  const books = await getBooks();
  const outCount = books.filter((book) => book.member_name).length;
  const availableCount = books.length - outCount;

  return (
    <>
      <div className="stat-strip" aria-label="Collection summary">
        <div className="stat-item"><span className="stat-number">{books.length}</span><span className="stat-label">Total books</span></div>
        <div className="stat-item"><span className="stat-number">{availableCount}</span><span className="stat-label">On the shelf</span></div>
        <div className="stat-item"><span className="stat-number">{outCount}</span><span className="stat-label">On loan</span></div>
      </div>
      <section className="collection-section" aria-labelledby="collection-heading">
        <div className="section-heading"><div><span className="eyebrow">THE COLLECTION</span><h2 id="collection-heading">Every story, accounted for.</h2></div><span className="collection-count">{books.length} TITLES</span></div>
        <BookRows books={books} />
      </section>
    </>
  );
}

function BooksFallback() {
  return <div className="loading-list" role="status">Opening the catalogue…</div>;
}

export default function Home() {
  return (
    <div className="app-frame">
      <SideNav current="books" />
      <main className="main-panel">
        <header className="page-header"><div><p className="breadcrumb">LIBRARY <span>/</span> BOOKS</p><h1>Books</h1></div><div className="header-note"><span className="live-dot" /> Synced with your library</div></header>
        <div className="page-content">
          <section className="intro-band">
            <div className="intro-copy"><span className="eyebrow">A PLACE FOR GOOD STORIES</span><h2>Find your next<br />favourite.</h2><p>Browse the shelves and see what is ready to borrow.</p></div>
            <div className="intro-art" aria-hidden="true"><div className="art-book art-book-one"><span>THE<br />READING<br />ROOM</span></div><div className="art-book art-book-two"><span>OPEN<br />A BOOK</span></div><div className="art-book art-book-three"><span>STORIES<br />LIVE HERE</span></div><div className="art-sun" /><div className="art-caption">EST. FOR<br />THE CURIOUS</div></div>
          </section>
          <Suspense fallback={<BooksFallback />}><BooksContent /></Suspense>
        </div>
      </main>
    </div>
  );
}
