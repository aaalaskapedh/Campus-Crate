import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function AdminPanel() {
  const [data, setData] = useState(null);

  function load() {
    api.get("/admin/dashboard").then((res) => setData(res.data));
  }

  useEffect(load, []);

  async function respondToClaim(claimId, decision) {
    await api.patch(`/claim/${claimId}`, { status: decision });
    load();
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-16 text-center font-mono text-sm text-ink-soft">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-2">
        Admin
      </p>
      <h1 className="font-display font-semibold text-3xl tracking-tight mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-5 mb-10">
        <div className="ticket p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-2">
            Total items
          </p>
          <p className="font-display text-4xl font-semibold">{data.stats.totalItems}</p>
        </div>
        <div className="ticket p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft mb-2">
            Total users
          </p>
          <p className="font-display text-4xl font-semibold">{data.stats.totalUsers}</p>
        </div>
      </div>

      <section className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-3">
          Pending claims ({data.pendingClaims.length})
        </p>
        {data.pendingClaims.length === 0 ? (
          <p className="text-ink-soft text-sm">Nothing pending.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.pendingClaims.map((claim) => (
              <div key={claim._id} className="ticket p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{claim.itemId?.title}</p>
                  <p className="text-ink-soft text-sm">
                    Claimed by {claim.claimantId?.name} ({claim.claimantId?.email})
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
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
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-3">
          Unresolved reports ({data.unresolvedReports.length})
        </p>
        {data.unresolvedReports.length === 0 ? (
          <p className="text-ink-soft text-sm">No open reports.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.unresolvedReports.map((report) => (
              <div key={report._id} className="ticket p-4">
                <p className="font-medium text-sm">{report.itemId?.title || "Item removed"}</p>
                <p className="text-ink-soft text-sm mt-1">{report.reason}</p>
                <p className="font-mono text-[10px] text-ink-soft mt-2">
                  Reported by {report.reportedBy?.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
