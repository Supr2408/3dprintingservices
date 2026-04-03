import { useMemo, useState } from "react";
import {
  getAdminOrders,
  updateAdminOrderStatus
} from "../api/services";
import ErrorBanner from "../components/ErrorBanner";
import LoadingSpinner from "../components/LoadingSpinner";

const statuses = ["Pending", "Printing", "Shipped"];
const hardcodedClientToken = import.meta.env.VITE_ADMIN_TOKEN || "admin-secret-123";
const backendBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/?$/, "");

function AdminPage() {
  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  );

  const authorize = async (event) => {
    event.preventDefault();
    setError("");

    if (token !== hardcodedClientToken) {
      setError("Invalid admin token.");
      return;
    }

    try {
      setLoading(true);
      const data = await getAdminOrders(token);
      setOrders(data);
      setAuthorized(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    const data = await getAdminOrders(token);
    setOrders(data);
  };

  const onStatusChange = async (orderId, status) => {
    try {
      setLoading(true);
      await updateAdminOrderStatus(orderId, status, token);
      await refreshOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <section className="mx-auto max-w-lg rounded-xl border border-cyan-500/30 bg-panel/90 p-6">
        <h2 className="font-heading text-3xl text-white">Admin Access</h2>
        <p className="mt-2 text-sm text-slate-400">Enter admin token to view and manage orders.</p>
        <ErrorBanner message={error} />
        <form onSubmit={authorize} className="mt-4 space-y-3">
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="w-full rounded-md border border-cyan-500/35 bg-base px-3 py-2 text-sm"
            placeholder="Admin token"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-cyan-400/20 px-4 py-3 font-heading text-lg text-cyan-100 shadow-glow"
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
          {loading ? <LoadingSpinner label="Verifying" /> : null}
        </form>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-4xl text-white">Admin Dashboard</h2>
        <button
          type="button"
          onClick={refreshOrders}
          className="rounded-md border border-cyan-500/40 bg-panel px-3 py-2 text-xs text-cyan-100"
        >
          Refresh Orders
        </button>
      </div>

      <ErrorBanner message={error} />
      {loading ? <LoadingSpinner label="Syncing orders" /> : null}

      <div className="space-y-4">
        {sortedOrders.length === 0 ? (
          <div className="rounded-lg border border-cyan-500/25 bg-panel/70 p-4 text-sm text-slate-300">
            No orders submitted yet.
          </div>
        ) : (
          sortedOrders.map((order) => (
            <article key={order.id} className="rounded-xl border border-cyan-500/25 bg-panel/90 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-2xl text-cyan-100">{order.id}</p>
                  <p className="text-xs text-slate-400">
                    {order.type.toUpperCase()} • {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(event) => onStatusChange(order.id, event.target.value)}
                  className="rounded-md border border-cyan-500/40 bg-base px-3 py-2 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
                <p>Customer: {order.customer?.name || "N/A"}</p>
                <p>Email: {order.customer?.email || "N/A"}</p>
                <p>Status: {order.status}</p>
                <p>Total: ${Number(order.total || order.estimatedPrice || 0).toFixed(2)}</p>
              </div>

              {order.type === "custom" && order.file ? (
                <a
                  href={`${backendBase}${order.file.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-neon hover:text-neonSoft"
                >
                  View Uploaded File ({order.file.originalName})
                </a>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default AdminPage;
