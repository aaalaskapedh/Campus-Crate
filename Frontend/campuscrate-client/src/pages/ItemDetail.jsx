import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [claimMessage, setClaimMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const isOwner = item && user && item.postedBy?._id === user.id;

  const loadItem = useCallback(() => {
    api.get(`/items/${id}`).then((res) => setItem(res.data.item));
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  useEffect(() => {
    if (isOwner) {
      api
        .get(`/claim/item/${id}`)
        .then((res) => setClaims(res.data.claims))
        .catch(() => {});
    }
  }, [isOwner, id]);

  async function submitClaim(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    try {
      await api.post("/claim", { itemId: id, message: claimMessage });
      setStatus("Claim submitted. The poster will review it.");
      setClaimMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit claim.");
    }
  }

  async function respondToClaim(claimId, decision) {
    await api.patch(`/claim/${claimId}`, { status: decision });
    api.get(`/claim/item/${id}`).then((res) => setClaims(res.data.claims));
    loadItem();
  }

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center font-mono text-sm text-ink-soft">
        Loading…
      </div>
    );
  }

  const isLost = item.type === "lost";

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <button
        onClick={() => navigate(-1)}
        className="font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-ink mb-6"
      >
        ← Back
      </button>

      <div className="ticket overflow-hidden">
        <div className="aspect-[16/9] bg-line/40 relative">
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
          <span
            className={`stamp absolute top-4 left-4 ${isLost ? "stamp-lost" : "stamp-found"}`}
          >
            {item.type}
          </span>
        </div>

        <div className="ticket-perforation" />

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h1 className="font-display font-semibold text-2xl">{item.title}</h1>
            <span className="font-mono text-xs text-ink-soft uppercase mt-1">
              {item.status}
            </span>
          </div>
          <p className="text-ink-soft text-sm mb-5">
            Posted by {item.postedBy?.name || "someone"}
            {item.location && ` · ${item.location}`}
          </p>

          {item.description && (
            <p className="text-ink mb-5 leading-relaxed">{item.description}</p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-ink-soft uppercase tracking-wide border-t border-line pt-4">
            {item.category && <span>Category: {item.category}</span>}
            {item.date && <span>Date: {new Date(item.date).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>

      {/* Claim form - shown to non-owners */}
      {user && !isOwner && item.status === "active" && (
        <form onSubmit={submitClaim} className="ticket p-6 mt-6 flex flex-col gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            {item.claimQuestion || "Explain why this is yours"}
          </span>
          <textarea
            className="input min-h-20"
            value={claimMessage}
            onChange={(e) => setClaimMessage(e.target.value)}
            placeholder="Describe an identifying detail…"
            required
          />
          {error && <p className="text-lost text-sm font-mono">{error}</p>}
          {status && <p className="text-found text-sm font-mono">{status}</p>}
          <button
            type="submit"
            className="self-start bg-ink text-paper font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded hover:opacity-90 transition-opacity"
          >
            Submit claim
          </button>
        </form>
      )}

      {/* Claims management - shown to the owner */}
      {isOwner && claims.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-3">
            Claims ({claims.length})
          </p>
          <div className="flex flex-col gap-3">
            {claims.map((claim) => (
              <div key={claim._id} className="ticket p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{claim.claimantId?.name}</p>
                    <p className="text-ink-soft text-sm mt-1">{claim.message}</p>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-ink-soft shrink-0">
                    {claim.status}
                  </span>
                </div>
                {claim.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => respondToClaim(claim._id, "approved")}
                      className="font-mono text-[10px] uppercase tracking-widest bg-found text-white px-3 py-1.5 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => respondToClaim(claim._id, "rejected")}
                      className="font-mono text-[10px] uppercase tracking-widest border border-line text-ink-soft px-3 py-1.5 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
