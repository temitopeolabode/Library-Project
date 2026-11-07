"use client";

import { useDeferredValue, useState } from "react";
import { Search, X } from "lucide-react";
import type { BookRecord } from "@/db";
import { BookList } from "./book-list";

export function CatalogSearch({ books }: { books: BookRecord[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLocaleLowerCase().includes(deferredQuery),
  );

  return (
    <>
      <label className="catalog-search" htmlFor="catalog-query">
        <Search size={17} aria-hidden="true" />
        <input
          id="catalog-query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by book or author"
          autoComplete="off"
        />
        {query ? <button className="search-clear" type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button> : null}
      </label>
      <div className="search-result-note" aria-live="polite">
        {deferredQuery ? `${filteredBooks.length} ${filteredBooks.length === 1 ? "book" : "books"} found` : "Search the collection"}
      </div>
      {filteredBooks.length ? <BookList books={filteredBooks} /> : <div className="empty-state search-empty"><BookListEmpty query={query.trim()} /></div>}
    </>
  );
}

function BookListEmpty({ query }: { query: string }) {
  return <p>No books found for “{query}”. Try another title or author.</p>;
}