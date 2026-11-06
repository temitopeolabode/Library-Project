"use client";

import { useActionState, useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { deleteBook, updateBook } from "../actions";

type Book = { id: number; title: string; year: number | null; author: string };
const emptyState: { error?: string; success?: string } = {};

export function BookControls({ book }: { book: Book }) {
  const [editing, setEditing] = useState(false);
  const [editState, editAction, editPending] = useActionState(updateBook, emptyState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteBook, emptyState);

  return (
    <div className="book-controls">
      {editing ? (
        <form action={editAction} className="edit-book-form">
          <input type="hidden" name="id" value={book.id} />
          <label className="sr-only" htmlFor={`title-${book.id}`}>Book title</label>
          <input id={`title-${book.id}`} name="title" defaultValue={book.title} required maxLength={200} />
          <label className="sr-only" htmlFor={`author-${book.id}`}>Author</label>
          <input id={`author-${book.id}`} name="author" defaultValue={book.author} required maxLength={160} />
          <label className="sr-only" htmlFor={`year-${book.id}`}>Publication year</label>
          <input id={`year-${book.id}`} name="year" type="number" min="1" max="9999" defaultValue={book.year ?? ""} required />
          {editState.error ? <p className="form-message error-message" role="alert">{editState.error}</p> : null}
          {editState.success ? <p className="form-message success-message" role="status">{editState.success}</p> : null}
          <div className="control-actions">
            <button className="icon-button save-button" type="submit" disabled={editPending} aria-label="Save book changes" title="Save changes"><Check size={15} /></button>
            <button className="icon-button" type="button" onClick={() => setEditing(false)} aria-label="Cancel editing" title="Cancel"><X size={15} /></button>
          </div>
        </form>
      ) : (
        <>
          <button className="icon-button" type="button" onClick={() => setEditing(true)} aria-label={`Edit ${book.title}`} title="Edit book"><Pencil size={15} /></button>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={book.id} />
            <button className="icon-button delete-button" type="submit" disabled={deletePending} aria-label={`Delete ${book.title}`} title="Delete book"><Trash2 size={15} /></button>
          </form>
          {deleteState.error ? <p className="form-message error-message control-message" role="alert">{deleteState.error}</p> : null}
          {deleteState.success ? <p className="form-message success-message control-message" role="status">{deleteState.success}</p> : null}
        </>
      )}
    </div>
  );
}