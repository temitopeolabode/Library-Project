import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getAuthor, getBooksByAuthor } from "@/db";
import { BookList } from "../../components/book-list";
import { SideNav } from "../../components/side-nav";

async function AuthorBooks({ authorId }: { authorId: number }) {
  const [author, books] = await Promise.all([getAuthor(authorId), getBooksByAuthor(authorId)]);
  if (!author) notFound();
  const onLoan = books.filter((book) => book.member_name).length;

  return (
    <>
      <section className="author-profile">
        <div className="author-monogram">{author.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</div>
        <div><span className="eyebrow">AUTHOR SHELF</span><h2>{author.name}</h2><p>{books.length} {books.length === 1 ? "book" : "books"} · {onLoan} currently on loan</p></div>
      </section>
      <section className="collection-section author-books-section" aria-labelledby="author-books-heading">
        <div className="section-heading"><div><span className="eyebrow">ON THE SHELF</span><h2 id="author-books-heading">Books by {author.name}</h2></div><span className="collection-count">{books.length} TITLES</span></div>
        <BookList books={books} controls={false} />
      </section>
    </>
  );
}

async function AuthorPageContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authorId = Number(id);
  if (!Number.isInteger(authorId) || authorId < 1) notFound();

  return (
    <div className="page-content">
      <Link className="back-link" href="/authors"><ArrowLeft size={15} /> All authors</Link>
      <Suspense fallback={<div className="loading-list" role="status">Opening this author’s shelf…</div>}><AuthorBooks authorId={authorId} /></Suspense>
    </div>
  );
}

export default function AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="app-frame">
      <SideNav current="authors" />
      <main className="main-panel">
        <header className="page-header"><div><p className="breadcrumb">LIBRARY <span>/</span> <Link href="/authors">AUTHORS</Link></p><h1>Author shelf</h1></div><div className="header-note"><span className="live-dot" /> Synced with your library</div></header>
        <Suspense fallback={<div className="loading-list" role="status">Opening author shelf…</div>}><AuthorPageContent params={params} /></Suspense>
      </main>
    </div>
  );
}