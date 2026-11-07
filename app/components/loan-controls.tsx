"use client";

import { useActionState, useState } from "react";
import { ArrowDownToLine, RotateCcw } from "lucide-react";
import { lendBook, returnBook } from "../actions";

type LoanOptions = { books: { id: number; title: string; author: string }[]; members: { id: number; name: string }[] };
const emptyState: { error?: string; success?: string } = {};

export function LoanControls({ options }: { options: LoanOptions }) {
  const [state, action, pending] = useActionState(lendBook, emptyState);
  const [loanDays, setLoanDays] = useState(14);

  return (
    <section className="loan-section" aria-labelledby="loan-heading">
      <div className="section-heading"><div><span className="eyebrow">A STORY GOES WITH YOU</span><h2 id="loan-heading">Lend a book</h2></div></div>
      {!options.books.length || !options.members.length ? (
        <p className="loan-hint">{!options.books.length ? "Every book is currently on loan." : "Add a member before lending a book."}</p>
      ) : (
        <form action={action} className="loan-form">
          <label className="field-label" htmlFor="loan-book">Book</label>
          <select id="loan-book" name="book_id" defaultValue="" required>
            <option value="" disabled>Choose an available book</option>
            {options.books.map((book) => <option key={book.id} value={book.id}>{book.title} · {book.author}</option>)}
          </select>
          <label className="field-label" htmlFor="loan-member">Member</label>
          <select id="loan-member" name="member_id" defaultValue="" required>
            <option value="" disabled>Choose a member</option>
            {options.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
          </select>
          <fieldset className="loan-duration-field">
            <legend className="field-label">Loan length</legend>
            <div className="loan-duration-options" aria-label="Choose loan duration">
              {[7, 14, 21, 30].map((days) => (
                <button
                  className={loanDays === days ? "duration-option selected" : "duration-option"}
                  key={days}
                  type="button"
                  aria-pressed={loanDays === days}
                  onClick={() => setLoanDays(days)}
                >
                  {days} days
                </button>
              ))}
            </div>
            <input type="hidden" name="days" value={loanDays} />
          </fieldset>
          {state.error ? <p className="form-message error-message" role="alert">{state.error}</p> : null}
          {state.success ? <p className="form-message success-message" role="status">{state.success}</p> : null}
          <button className="primary-button" type="submit" disabled={pending}><ArrowDownToLine size={16} />{pending ? "Lending…" : `Lend for ${loanDays} days`}</button>
        </form>
      )}
    </section>
  );
}

export function ReturnBookButton({ bookId, title }: { bookId: number; title: string }) {
  const [state, action, pending] = useActionState(returnBook, emptyState);

  return (
    <div className="return-control">
      <form action={action}>
        <input type="hidden" name="book_id" value={bookId} />
        <button className="return-button" type="submit" disabled={pending} aria-label={`Record return of ${title}`}><RotateCcw size={14} />{pending ? "Returning…" : "Record return"}</button>
      </form>
      {state.error ? <p className="form-message error-message" role="alert">{state.error}</p> : null}
      {state.success ? <p className="form-message success-message" role="status">{state.success}</p> : null}
    </div>
  );
}