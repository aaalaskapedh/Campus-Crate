import { Link } from "react-router-dom";

// Turns "68a7...ee85" into a short ticket-style code like "8B-3EE85"
function ticketCode(id) {
  const tail = id.slice(-6).toUpperCase();
  return `${tail.slice(0, 2)}-${tail.slice(2)}`;
}

export default function ItemCard({ item }) {
  const isLost = item.type === "lost";

  return (
    <Link
      to={`/item/${item._id}`}
      className="ticket flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
    >
      <div className="aspect-[4/3] bg-line/40 relative overflow-hidden">
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-soft font-mono text-xs">
            NO PHOTO
          </div>
        )}
        <span className={`stamp absolute top-3 left-3 ${isLost ? "stamp-lost" : "stamp-found"}`}>
          {isLost ? "Lost" : "Found"}
        </span>
      </div>

      <div className="ticket-perforation" />

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-medium text-lg leading-snug text-ink">
            {item.title}
          </h3>
          <span className="font-mono text-[10px] text-ink-soft mt-1 shrink-0">
            #{ticketCode(item._id)}
          </span>
        </div>

        {item.location && (
          <p className="text-sm text-ink-soft">{item.location}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-ink-soft font-mono">
          <span>{item.category || "Uncategorized"}</span>
          <span className="uppercase tracking-wide">{item.status}</span>
        </div>
      </div>
    </Link>
  );
}
