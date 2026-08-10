import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ItemCard from "../components/ItemCard";

const TABS = [
  { key: "", label: "All" },
  { key: "lost", label: "Lost" },
  { key: "found", label: "Found" },
];

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (tab) params.type = tab;
    if (search) params.search = search;

    api
      .get("/items", { params })
      .then((res) => setItems(res.data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [tab, search]);

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">
            The board
          </p>
          <h1 className="font-display font-semibold text-3xl tracking-tight">
            What's been turned in
          </h1>
        </div>

        <input
          type="text"
          placeholder="Search by title, category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 bg-card border border-line rounded px-3 py-2 text-sm font-body placeholder:text-ink-soft focus:border-ink outline-none"
        />
      </div>

      <div className="flex gap-1 mb-8 font-mono text-xs uppercase tracking-wide">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              tab === t.key
                ? "bg-ink text-paper border-ink"
                : "border-line text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-mono text-sm text-ink-soft">Loading items…</p>
      ) : items.length === 0 ? (
        <div className="ticket p-10 text-center">
          <p className="font-display text-xl mb-1">Nothing here yet</p>
          <p className="text-ink-soft text-sm">
            Be the first to post a lost or found item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
