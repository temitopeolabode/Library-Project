import { Suspense } from "react";
import { getBooks } from "@/db";
import { SideNav } from "./components/side-nav";
import { AddBookForm } from "./components/add-book-form";
import { CatalogSearch } from "./components/catalog-search";
import { LoanControls } from "./components/loan-controls";

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
        <CatalogSearch books={books} />
      </section>
    </>
  );
}

async function LendingContent() {
  const { getLoanOptions } = await import("@/db");
  const options = await getLoanOptions();
  return <LoanControls options={options} />;
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
          <Suspense fallback={<BooksFallback />}><LendingContent /></Suspense>
          <section className="add-section" aria-labelledby="add-book-heading">
            <div className="section-heading"><div><span className="eyebrow">GROW THE SHELVES</span><h2 id="add-book-heading">Add a book</h2></div></div>
            <AddBookForm />
          </section>
        </div>
      </main>
    </div>
  );
}
