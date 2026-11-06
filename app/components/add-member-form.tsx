"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";
import { addMember } from "../actions";

const initialState: { error?: string; success?: string } = {};

export function AddMemberForm() {
  const [state, action, pending] = useActionState(addMember, initialState);

  return (
    <form action={action} className="add-member-form">
      <label className="field-label" htmlFor="member-name">Name</label>
      <input id="member-name" name="name" placeholder="e.g. Bola Ade" required maxLength={160} />
      <label className="field-label" htmlFor="member-phone">Phone <span>(optional)</span></label>
      <input id="member-phone" name="phone" type="tel" placeholder="e.g. 0801 234 5678" maxLength={40} />
      {state.error ? <p className="form-message error-message" role="alert">{state.error}</p> : null}
      {state.success ? <p className="form-message success-message" role="status">{state.success}</p> : null}
      <button className="primary-button" type="submit" disabled={pending}><UserPlus size={16} />{pending ? "Adding…" : "Add member"}</button>
    </form>
  );
}