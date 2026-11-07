import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, LibraryBig } from "lucide-react";
import { getAuthors } from "@/db";
import { SideNav } from "../components/side-nav";

async function AuthorsContent() {
  const authors = await getAuthors();

  return (
    <section className="collection-section" aria-labelledby="authors-heading">
      <div className="section-heading"><div><span className="eyebrow">THE VOICES ON OUR SHELVES</span><h2 id="authors-heading">Meet the authors.</h2></div><span className="collection-count">{authors.length} AUTHORS</span></div>
      {authors.length ? (
        <div className="author-list">
          {authors.map((author, index) => (
            <Link className="author-row" href={`/authors/${author.id}`} key={author.id}>
              <span className={`author-index author-color-${index % 5}`}>{String(index + 1).padStart(2, "0")}</span>
              <span className="author-name">{author.name}</span>
              <span className="author-count">{author.book_count} {author.book_count === 1 ? "book" : "books"}<span className="author-loans"> · {author.loan_count} on loan</span></span>
              <ArrowUpRight className="author-arrow" size={18} strokeWidth={1.7} />
            </Link>
          ))}
        </div>
      ) : <div className="empty-state"><LibraryBig size={26} strokeWidth={1.5} /><p>No authors in the collection yet.</p></div>}
    </section>
  );
}

export default function AuthorsPage() {
  return (
    <div className="app-frame">
      <SideNav current="authors" />
      <main className="main-panel">
        <header className="page-header"><div><p className="breadcrumb">LIBRARY <span>/</span> AUTHORS</p><h1>Authors</h1></div><div className="header-note"><span className="live-dot" /> Synced with your library</div></header>
        <div className="page-content">
          <section className="intro-band authors-intro"><div className="intro-copy"><span className="eyebrow">BEHIND EVERY GOOD STORY</span><h2>Stories start<br />with a voice.</h2><p>Explore the writers represented on our shelves.</p></div><div className="author-quote" aria-hidden="true"><span>“</span><p>One book<br />can open<br />a whole world.</p></div></section>
          <Suspense fallback={<div className="loading-list" role="status">Gathering the authors…</div>}><AuthorsContent /></Suspense>
        </div>
      </main>
    </div>
  );
}