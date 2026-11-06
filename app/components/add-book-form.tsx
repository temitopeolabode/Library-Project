"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { addBook } from "../actions";

const initialState: { error?: string; success?: string } = {};

export function AddBookForm() {
  const [state, action, pending] = useActionState(addBook, initialState);

  return (
    <form action={action} className="add-book-form">
      <label className="field-label" htmlFor="book-title">Title</label>
      <input id="book-title" name="title" placeholder="e.g. The Famished Road" required maxLength={200} />
      <label className="field-label" htmlFor="book-author">Author</label>
      <input id="book-author" name="author" placeholder="e.g. Ben Okri" required maxLength={160} />
      <label className="field-label" htmlFor="book-year">Year</label>
      <input id="book-year" name="year" type="number" min="1" max="9999" placeholder="1991" required />
      {state.error ? <p className="form-message error-message" role="alert">{state.error}</p> : null}
      {state.success ? <p className="form-message success-message" role="status">{state.success}</p> : null}
      <button className="primary-button" type="submit" disabled={pending}><Plus size={16} />{pending ? "Adding…" : "Add book"}</button>
    </form>
  );
}