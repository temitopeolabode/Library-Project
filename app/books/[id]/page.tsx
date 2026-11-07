import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, CircleCheck, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";
import { getBook } from "@/db";
import { SideNav } from "../../components/side-nav";

async function BookPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = Number(id);
  if (!Number.isInteger(bookId) || bookId < 1) notFound();

  const book = await getBook(bookId);
  if (!book) notFound();

  return (
    <div className="page-content book-detail-content">
      <Link className="back-link" href="/"><ArrowLeft size={15} /> All books</Link>
      <article className="book-detail-layout">
        <div className={`book-detail-cover cover-${book.id % 5}`} aria-label={`Book cover for ${book.title} by ${book.author}`}>
          <div className="cover-rule" aria-hidden="true" />
          <span className="cover-title">{book.title}</span>
          <Link className="cover-author" href={`/authors/${book.author_id}`}>{book.author}</Link>
          <div className="cover-rule" aria-hidden="true" />
        </div>
        <div className="book-detail-copy">
          <span className="eyebrow">BIBLOTHECA COLLECTION{book.year ? ` · ${book.year}` : ""}</span>
          <div className="book-detail-status">
            {book.member_name ? (
              <><span className="status-pill on-loan"><Clock3 size={13} /> On loan</span><p>On loan to {book.member_name}{book.due_on ? `, due ${book.due_on}` : ""}</p></>
            ) : (
              <><span className="status-pill available"><CircleCheck size={13} /> Available</span><p>Ready to borrow from the shelf</p></>
            )}
          </div>
          <section className="book-summary" aria-labelledby="summary-heading">
            <span className="eyebrow">A LITTLE ABOUT THE STORY</span>
            <h3 id="summary-heading">What to expect</h3>
            <p>{book.summary}</p>
          </section>
        </div>
      </article>
    </div>
  );
}

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="app-frame">
      <SideNav current="books" />
      <main className="main-panel">
        <header className="page-header"><div><p className="breadcrumb">LIBRARY <span>/</span> BOOKS</p><h1>Book details</h1></div><div className="header-note"><span className="live-dot" /> Synced with your library</div></header>
        <Suspense fallback={<div className="loading-list" role="status">Opening this book…</div>}><BookPageContent params={params} /></Suspense>
      </main>
    </div>
  );
}