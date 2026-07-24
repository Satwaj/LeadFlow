import { useState } from "react";
import Button from "../common/Button.jsx";
import EmptyState from "../common/EmptyState.jsx";
import Textarea from "../common/Textarea.jsx";
import { formatDateTime } from "../../utils/formatDate.js";

const NotesPanel = ({ notes = [], onAddNote, loading }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) {
      setError("Note cannot be blank");
      return;
    }
    setError("");
    const ok = await onAddNote(text.trim());
    if (ok) setText("");
  };

  return (
    <section className="panel p-5">
      <h3 className="mb-4 text-lg font-semibold">Notes</h3>
      <form className="mb-5 space-y-3" onSubmit={submit}>
        <Textarea
          label="Add an internal note"
          placeholder="Customer requested a proposal by Friday."
          value={text}
          onChange={(event) => setText(event.target.value)}
          error={error}
        />
        <Button type="submit" loading={loading}>
          Add note
        </Button>
      </form>
      {notes.length === 0 ? (
        <EmptyState title="No notes yet." description="Add the first internal note for this lead." />
      ) : (
        <div className="space-y-3">
          {[...notes].reverse().map((note) => (
            <article key={note._id || `${note.createdAt}-${note.text}`} className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-white p-3">
              <p className="text-sm leading-6">{note.text}</p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                {note.author?.name || "Unknown"} · {formatDateTime(note.createdAt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default NotesPanel;
