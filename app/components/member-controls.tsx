"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteMember } from "../actions";

const emptyState: { error?: string; success?: string } = {};

export function MemberControls({ id, name }: { id: number; name: string }) {
  const [state, action, pending] = useActionState(deleteMember, emptyState);

  return (
    <div className="member-controls">
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button className="icon-button delete-button" type="submit" disabled={pending} aria-label={`Remove ${name}`} title="Remove member">
          <Trash2 size={15} />
        </button>
      </form>
      {state.error ? <p className="form-message error-message" role="alert">{state.error}</p> : null}
      {state.success ? <p className="form-message success-message" role="status">{state.success}</p> : null}
    </div>
  );
}