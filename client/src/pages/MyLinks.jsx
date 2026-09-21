
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_URL from "../utils/api";
function MyLinks() {
  const { token } = useAuth();

  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);

  const fetchLinks = useCallback(async (isRefresh = false) => {
    try {
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(`${API_URL}/api/urls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load links");
      }

      setLinks(data.urls || data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
  let cancelled = false;

  const loadLinks = async () => {
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/urls`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load links");
      }

      if (!cancelled) {
        setLinks(data.urls || data);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Something went wrong");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadLinks();

  return () => {
    cancelled = true;
  };
}, [token]);

  const getLinkStatus = (link) => {
    if (!link.is_active) {
      return {
        label: "Inactive",
        className: "bg-red-500/10 text-red-400",
      };
    }

    if (link.expires_at && new Date(link.expires_at) <= new Date()) {
      return {
        label: "Expired",
        className: "bg-amber-500/10 text-amber-400",
      };
    }

    return {
      label: "Active",
      className: "bg-emerald-500/10 text-emerald-400",
    };
  };

  const formatExpiry = (expiresAt) => {
    if (!expiresAt) return "Never expires";

    const date = new Date(expiresAt);

    if (Number.isNaN(date.getTime())) {
      return "Invalid expiry";
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredLinks = useMemo(() => {
    const query = search.toLowerCase().trim();

    let result = links.filter((link) => {
      const matchesSearch =
        !query ||
        link.short_code?.toLowerCase().includes(query) ||
        link.original_url?.toLowerCase().includes(query);

      const status = getLinkStatus(link).label.toLowerCase();

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.created_at || 0) -
          new Date(b.created_at || 0)
        );
      }

      if (sortBy === "most-clicks") {
        return (b.click_count ?? 0) - (a.click_count ?? 0);
      }

      if (sortBy === "least-clicks") {
        return (a.click_count ?? 0) - (b.click_count ?? 0);
      }

      return 0;
    });

    return result;
  }, [links, search, statusFilter, sortBy]);

  const handleCopy = async (link) => {
    const shortUrl = `${API_URL}/${link.short_code}`;

    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopiedId(link.id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch {
      setError("Failed to copy the short URL.");
    }
  };

  const activeCount = links.filter(
    (link) => getLinkStatus(link).label === "Active"
  ).length;

  const expiredCount = links.filter(
    (link) => getLinkStatus(link).label === "Expired"
  ).length;

  const totalClicks = links.reduce(
    (total, link) => total + (link.click_count ?? 0),
    0
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="animate-pulse">
          <div className="mb-3 h-4 w-24 rounded bg-zinc-800" />
          <div className="h-9 w-48 rounded bg-zinc-800" />
          <div className="mt-3 h-4 w-80 rounded bg-zinc-800" />
        </div>
      </main>
    );
  }

  if (error && links.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
          <h2 className="text-lg font-medium text-white">
            Unable to load your links
          </h2>

          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>

          <button
            onClick={() => fetchLinks()}
            className="mt-5 inline-flex h-9 items-center justify-center rounded-lg border border-zinc-800 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium tracking-widest text-zinc-500">
          SHORTIFY
        </p>

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              My Links
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage and track all the URLs you have created.
            </p>
          </div>

          <button
            onClick={() => fetchLinks(true)}
            disabled={refreshing}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-zinc-800 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stats */}
      {links.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Total Links
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {links.length}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Active Links
            </p>

            <p className="mt-2 text-2xl font-semibold text-emerald-400">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Total Clicks
            </p>

            <p className="mt-2 text-2xl font-semibold text-white">
              {totalClicks}
            </p>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      {links.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 lg:flex-row">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by short code or original URL..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-zinc-600"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-zinc-600"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="most-clicks">Most clicks</option>
            <option value="least-clicks">Least clicks</option>
          </select>
        </div>
      )}

      {/* Results count */}
      {links.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-zinc-500">
            Showing {filteredLinks.length} of {links.length} links
          </p>

          {expiredCount > 0 && (
            <p className="text-xs text-amber-500/80">
              {expiredCount} expired
            </p>
          )}
        </div>
      )}

      {/* Empty states */}
      {links.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
          <h2 className="text-lg font-medium text-white">
            No links yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Create your first short URL from the dashboard.
          </p>
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
          <h2 className="text-lg font-medium text-white">
            No matching links
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left">
              <thead className="border-b border-zinc-800 bg-zinc-900">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Short URL
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Original URL
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Clicks
                  </th>

                  <th className="px-6 py-4 text-sm font-medium text-zinc-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-medium text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredLinks.map((link) => {
                  const shortUrl = `${API_URL}/${link.short_code}`;
                  const status = getLinkStatus(link);

                  return (
                    <tr
                      key={link.id}
                      className="border-b border-zinc-800 transition hover:bg-zinc-800/30 last:border-b-0"
                    >
                      {/* Short URL */}
                      <td className="px-6 py-5">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-white hover:underline"
                        >
                          /{link.short_code}
                        </a>
                      </td>

                      {/* Original URL */}
                      <td className="max-w-md px-6 py-5">
                        <p
                          title={link.original_url}
                          className="truncate text-sm text-zinc-400"
                        >
                          {link.original_url}
                        </p>
                      </td>

                      {/* Clicks */}
                      <td className="px-6 py-5">
                        <span className="text-sm font-medium text-zinc-300">
                          {link.click_count ?? 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                          >
                            {status.label}
                          </span>

                          <span className="text-xs text-zinc-600">
                            {link.expires_at
                              ? `Expires ${formatExpiry(link.expires_at)}`
                              : "Never expires"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleCopy(link)}
                            className="inline-flex h-9 min-w-16 items-center justify-center rounded-lg border border-zinc-800 px-3 text-xs font-medium leading-none text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                          >
                            {copiedId === link.id ? "Copied" : "Copy"}
                          </button>

                          <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 min-w-16 items-center justify-center rounded-lg border border-zinc-800 px-3 text-xs font-medium leading-none text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                          >
                            Open
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyLinks;

