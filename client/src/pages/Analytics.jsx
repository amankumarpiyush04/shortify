import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { apiFetch } from "../utils/api";

const API_URL =
  import.meta.env.VITE_API_URL || window.location.origin;

function Analytics() {
  const [links, setLinks] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================
     FETCH LINKS
  ========================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchLinks = async () => {
      try {
        const response = await apiFetch("/api/urls");

        if (!response.ok) {
          throw new Error("Failed to load links");
        }

        const data = await response.json();

        const linkList = Array.isArray(data)
          ? data
          : data.urls || data.data || [];

        if (cancelled) return;

        setLinks(linkList);

        if (linkList.length > 0) {
          setSelectedId(String(linkList[0].id));
        }
      } catch (err) {
        if (cancelled) return;

        console.error("Links error:", err);
        setError(err.message || "Failed to load links");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchLinks();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================
     FETCH SELECTED LINK ANALYTICS
  ========================================= */

  useEffect(() => {
    if (!selectedId) return;

    let cancelled = false;

    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        setError("");

        const response = await apiFetch(
          `/api/urls/${selectedId}/analytics`
        );

        if (!response.ok) {
          throw new Error("Failed to load analytics");
        }

        const data = await response.json();

        if (cancelled) return;

        console.log("Analytics API response:", data);

        setAnalytics(data);
      } catch (err) {
        if (cancelled) return;

        console.error("Analytics error:", err);

        setError(err.message || "Failed to load analytics");
        setAnalytics(null);
      } finally {
        if (!cancelled) {
          setAnalyticsLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  /* =========================================
     PAGE
  ========================================= */

  return (
    <main className="w-full px-6 py-16 md:px-10 lg:px-12">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
          Analytics
        </p>

        <h1 className="mt-4 text-4xl font-medium tracking-[-0.035em] text-zinc-100 md:text-5xl">
          Understand your traffic.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
          Inspect clicks, referrers, browsers, operating systems,
          and devices for your shortened links.
        </p>
      </div>

      {/* Link Selector */}
      <section className="mt-12 border-y border-white/6">
        <div className="flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-300">
              Select a link
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Choose a shortened URL to inspect its performance.
            </p>
          </div>

          <div className="w-full md:w-105">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={links.length === 0}
              className="h-11 w-full appearance-none rounded-lg border border-white/8 bg-[#101012] px-3.5 text-sm text-zinc-300 outline-none transition-colors focus:border-white/18 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {links.length === 0 ? (
                <option value="">No links available</option>
              ) : (
                links.map((link) => (
                  <option key={link.id} value={link.id}>
                    {API_URL}/{link.short_code}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}

      {/* Content */}
      {loading ? (
        <AnalyticsSkeleton />
      ) : links.length === 0 ? (
        <EmptyState />
      ) : analyticsLoading ? (
        <div className="mt-12 h-72 animate-pulse border-y border-white/6 bg-white/1" />
      ) : analytics ? (
        <AnalyticsContent analytics={analytics} />
      ) : null}
    </main>
  );
}

/* =========================================
   ANALYTICS CONTENT
========================================= */

function AnalyticsContent({ analytics }) {
  /*
    Backend response:

    {
      url: {
        id,
        original_url,
        short_code,
        created_at,
        expires_at,
        click_count,
        is_active
      },
      totalClicks,
      clicksOverTime,
      topReferrers,
      browsers,
      operatingSystems,
      devices
    }
  */

  const url = analytics.url || {};

  const clicksOverTime = Array.isArray(
    analytics.clicksOverTime
  )
    ? analytics.clicksOverTime
    : [];

  const referrers = Array.isArray(analytics.topReferrers)
    ? analytics.topReferrers
    : [];

  const browsers = Array.isArray(analytics.browsers)
    ? analytics.browsers
    : [];

  const operatingSystems = Array.isArray(
    analytics.operatingSystems
  )
    ? analytics.operatingSystems
    : [];

  const devices = Array.isArray(analytics.devices)
    ? analytics.devices
    : [];

  return (
    <>
      {/* Link Information */}
      <section className="mt-12 border-y border-white/6">
        <div className="flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs text-zinc-600">
              Short URL
            </p>

            <p className="mt-2 break-all text-sm font-medium text-zinc-200">
              {API_URL}/{url.short_code || "—"}
            </p>

            <p
              title={url.original_url}
              className="mt-2 truncate text-xs text-zinc-600"
            >
              {url.original_url || "—"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-8">
            <div>
              <p className="text-xs text-zinc-600">
                Created
              </p>

              <p className="mt-1 text-sm text-zinc-400">
                {url.created_at
                  ? formatDateTime(url.created_at)
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-zinc-600">
                Status
              </p>

              <p
                className={`mt-1 text-sm ${
                  url.is_active
                    ? "text-emerald-400"
                    : "text-zinc-500"
                }`}
              >
                {url.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="mt-12 grid gap-px border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Total clicks"
          value={analytics.totalClicks}
        />

        <Stat
          label="Referrers"
          value={referrers.length}
        />

        <Stat
          label="Browsers"
          value={browsers.length}
        />

        <Stat
          label="Devices"
          value={devices.length}
        />
      </div>

      {/* Click Activity */}
      <section className="mt-12 border-y border-white/6">
        <div className="flex flex-col justify-between gap-2 border-b border-white/6 py-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-zinc-300">
              Click activity
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Clicks for this shortened URL.
            </p>
          </div>

          <p className="text-xs text-zinc-700">
            {clicksOverTime.length > 0
              ? `${formatDate(
                  clicksOverTime[0].date
                )} — ${formatDate(
                  clicksOverTime[
                    clicksOverTime.length - 1
                  ].date
                )}`
              : "No activity"}
          </p>
        </div>

        <ClickChart data={clicksOverTime} />
      </section>

      {/* Traffic Breakdown */}
      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <Breakdown
          title="Browsers"
          subtitle="Browsers used to open this link."
          data={browsers}
          labelKey="browser"
        />

        <Breakdown
          title="Operating systems"
          subtitle="Operating systems generating traffic."
          data={operatingSystems}
          labelKey="os"
        />

        <Breakdown
          title="Devices"
          subtitle="Device types used by visitors."
          data={devices}
          labelKey="device"
        />
      </div>

      {/* Referrers */}
      <section className="mt-12 border-y border-white/6">
        <div className="border-b border-white/6 py-6">
          <p className="text-sm font-medium text-zinc-300">
            Top referrers
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Where visitors came from before opening this link.
          </p>
        </div>

        <div className="divide-y divide-white/5">
          {referrers.length === 0 ? (
            <p className="py-8 text-sm text-zinc-600">
              No referrer data yet.
            </p>
          ) : (
            referrers.map((referrer, index) => (
              <motion.div
                key={`${referrer.referrer}-${index}`}
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.03,
                }}
                className="flex items-center justify-between gap-6 py-4"
              >
                <p className="truncate text-sm text-zinc-400">
                  {referrer.referrer}
                </p>

                <p className="shrink-0 text-xs text-zinc-600">
                  {Number(
                    referrer.clicks || 0
                  ).toLocaleString()}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

/* =========================================
   STAT
========================================= */

function Stat({ label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#09090b] p-6"
    >
      <p className="text-xs text-zinc-600">
        {label}
      </p>

      <p className="mt-3 text-3xl font-medium tracking-tight text-zinc-200">
        {Number(value || 0).toLocaleString()}
      </p>
    </motion.div>
  );
}

/* =========================================
   BREAKDOWN
========================================= */

function Breakdown({
  title,
  subtitle,
  data,
  labelKey,
}) {
  return (
    <section>
      <div className="border-b border-white/6 pb-5">
        <p className="text-sm font-medium text-zinc-300">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-600">
          {subtitle}
        </p>
      </div>

      <div className="divide-y divide-white/5">
        {data.length === 0 ? (
          <p className="py-8 text-sm text-zinc-600">
            No data yet.
          </p>
        ) : (
          data.slice(0, 6).map((item, index) => (
            <div
              key={`${item[labelKey]}-${index}`}
              className="flex items-center justify-between gap-4 py-4"
            >
              <p className="truncate text-sm text-zinc-400">
                {item[labelKey]}
              </p>

              <span className="shrink-0 text-xs text-zinc-600">
                {Number(
                  item.clicks || 0
                ).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* =========================================
   CLICK CHART
========================================= */

function ClickChart({ data }) {
  const chartData = data.map((item) => ({
    date: new Date(item.date),
    clicks: Number(item.clicks || 0),
  }));

  if (!chartData.length) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-sm text-zinc-600">
          No click activity yet.
        </p>
      </div>
    );
  }

  const width = 1000;
  const height = 300;

  const paddingLeft = 42;
  const paddingRight = 16;
  const paddingTop = 20;
  const paddingBottom = 42;

  const chartWidth =
    width - paddingLeft - paddingRight;

  const chartHeight =
    height - paddingTop - paddingBottom;

  const maxClicks = Math.max(
    ...chartData.map((item) => item.clicks),
    1
  );

  const points = chartData.map((item, index) => {
    const x =
      chartData.length === 1
        ? paddingLeft + chartWidth / 2
        : paddingLeft +
          (index / (chartData.length - 1)) *
            chartWidth;

    const y =
      paddingTop +
      chartHeight -
      (item.clicks / maxClicks) *
        chartHeight;

    return {
      ...item,
      x,
      y,
    };
  });

  const linePath = points
    .map((point, index) =>
      index === 0
        ? `M ${point.x} ${point.y}`
        : `L ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = `
    ${linePath}
    L ${points[points.length - 1].x} ${
      paddingTop + chartHeight
    }
    L ${points[0].x} ${
      paddingTop + chartHeight
    }
    Z
  `;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full overflow-hidden px-2 py-6 sm:px-4">
      <div className="relative h-72 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          {gridLines.map((ratio) => {
            const y =
              paddingTop +
              chartHeight * (1 - ratio);

            const value = Math.round(
              maxClicks * ratio
            );

            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  x2={width - paddingRight}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.055)"
                  strokeWidth="1"
                />

                <text
                  x="0"
                  y={y + 4}
                  fill="rgba(255,255,255,0.22)"
                  fontSize="9"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <motion.path
            d={areaPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            fill="rgba(255,255,255,0.025)"
          />

          <motion.path
            d={linePath}
            fill="none"
            stroke="rgba(212,212,216,0.75)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />

          {points.map((point) => (
            <g key={point.date.toISOString()}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#09090b"
                stroke="rgba(228,228,231,0.85)"
                strokeWidth="0.5"
              />

              <title>
                {formatDate(point.date)}:{" "}
                {point.clicks} clicks
              </title>
            </g>
          ))}

          {getLabelIndexes(chartData.length).map(
            (index) => {
              const point = points[index];

              return (
                <text
                  key={index}
                  x={point.x}
                  y={height - 12}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.25)"
                  fontSize="9"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {formatDate(point.date)}
                </text>
              );
            }
          )}
        </svg>
      </div>
    </div>
  );
}

/* =========================================
   EMPTY STATE
========================================= */

function EmptyState() {
  return (
    <section className="mt-12 border-y border-white/6 py-16">
      <p className="text-sm text-zinc-500">
        No shortened links yet.
      </p>

      <p className="mt-2 text-xs text-zinc-700">
        Create a link from the Home page to start seeing
        analytics.
      </p>
    </section>
  );
}

/* =========================================
   HELPERS
========================================= */

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function formatDateTime(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getLabelIndexes(length) {
  if (length <= 1) return [0];

  if (length <= 4) {
    return Array.from(
      { length },
      (_, index) => index
    );
  }

  return [
    0,
    Math.floor(length / 2),
    length - 1,
  ];
}

/* =========================================
   SKELETON
========================================= */

function AnalyticsSkeleton() {
  return (
    <main className="w-full px-6 py-16 md:px-10 lg:px-12">
      <div className="h-3 w-20 animate-pulse bg-white/5" />

      <div className="mt-5 h-12 w-96 max-w-full animate-pulse bg-white/5" />

      <div className="mt-12 h-20 animate-pulse border-y border-white/6 bg-white/1" />

      <div className="mt-12 grid gap-px border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse bg-[#09090b]"
          />
        ))}
      </div>

      <div className="mt-12 h-80 animate-pulse border-y border-white/6 bg-white/1" />
    </main>
  );
}

export default Analytics;