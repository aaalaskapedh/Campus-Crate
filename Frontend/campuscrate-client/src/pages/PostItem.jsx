import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

const CATEGORIES = ["Electronics", "ID Card", "Bag", "Keys", "Clothing", "Books", "Other"];

export default function PostItem() {
  const navigate = useNavigate();
  const [type, setType] = useState("lost");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    claimQuestion: "",
  });
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Give the item a title.");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("type", type);
      Object.entries(form).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });
      if (photo) data.append("photo", photo);

      const res = await api.post("/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/item/${res.data.item._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">
        New listing
      </p>
      <h1 className="font-display font-semibold text-3xl tracking-tight mb-8">
        Post an item
      </h1>

      <div className="flex gap-1 mb-8 font-mono text-xs uppercase tracking-wide">
        {["lost", "found"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`px-5 py-2 rounded-full border transition-colors ${
              type === t
                ? t === "lost"
                  ? "bg-lost text-white border-lost"
                  : "bg-found text-white border-found"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            I {t} this
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="ticket p-6 flex flex-col gap-5">
        <Field label="Title">
          <input
            className="input"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Black Wildcraft backpack"
          />
        </Field>

        <Field label="Description">
          <textarea
            className="input min-h-24"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Distinguishing details — color, brand, contents…"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select
              className="input"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">Select…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date">
            <input
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Location on campus">
          <input
            className="input"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="e.g. Library, 2nd floor"
          />
        </Field>

        <Field label="Photo">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="text-sm font-mono text-ink-soft"
          />
        </Field>

        <Field label="Verification question (optional)">
          <input
            className="input"
            value={form.claimQuestion}
            onChange={(e) => update("claimQuestion", e.target.value)}
            placeholder="Something only the true owner would know"
          />
        </Field>

        {error && <p className="text-lost text-sm font-mono">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-ink text-paper font-mono text-xs uppercase tracking-widest py-3 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Posting…" : "Post listing"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}
