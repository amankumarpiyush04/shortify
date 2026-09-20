import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { apiFetch } from "../utils/api";

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiFetch(
  "/api/urls/analytics/overview"
);
        if (!response.ok) {
          throw new Error("Failed to load dashboard");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    
    fetchDashboard();
  }, []);

  const chartData = useMemo(() => {
    if (!data?.clicksOverTime) return [];

    return data.clicksOverTime.map((item) => ({
      date: new Date(item.date),
      clicks: Number(item.clicks),
    }));
  }, [data]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <main className="w-full px-6 py-20 md:px-10 lg:px-12">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-600">
          Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-medium tracking-[-0.035em] text-zinc-100">
          Overview
        </h1>

        <p className="mt-6 text-sm text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="w-full px-6 py-16 md:px-10 lg:px-12">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
          Dashboard
        </p>

        <h1 className="mt-4 text-4xl font-medium tracking-[-0.035em] text-zinc-100 md:text-5xl">
          Overview
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
          A quick view of your links and their performance.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-12 grid gap-px border border-white/6 bg-white/6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total links" value={data.totalUrls} />
        <Stat label="Total clicks" value={data.totalClicks} />
        <Stat label="Active links" value={data.activeUrls} />
        <Stat label="Expired links" value={data.expiredUrls} />
      </div>

      {/* Click Activity */}
      <section className="mt-12 border-y border-white/6">
        <div className="flex flex-col justify-between gap-2 border-b border-white/6 py-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-zinc-300">
              Click activity
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Clicks across all shortened URLs.
            </p>
          </div>

          <p className="text-xs text-zinc-700">
            {chartData.length > 0
              ? `${formatDate(chartData[0].date)} — ${formatDate(
                  chartData[chartData.length - 1].date
                )}`
              : "No activity"}
          </p>
        </div>

        <ClickChart data={chartData} />
      </section>

      {/* Bottom */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Top Links */}
        <section>
          <div className="border-b border-white/6 pb-5">
            <p className="text-sm font-medium text-zinc-300">
              Top links
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Your most clicked URLs.
            </p>
          </div>

          <div className="divide-y divide-white/5">
            {data.topLinks.length === 0 ? (
              <p className="py-8 text-sm text-zinc-600">
                No links yet.
              </p>
            ) : (
              data.topLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.04,
                  }}
                  className="flex min-w-0 items-center gap-5 py-5"
                >
                  <span className="w-5 shrink-0 font-mono text-xs text-zinc-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-zinc-300">
                      {API_URL}/{link.short_code}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-700">
                      {link.original_url}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm text-zinc-400">
                      {Number(link.click_count).toLocaleString()}
                    </p>

                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-zinc-700">
                      clicks
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Referrers */}
        <section>
          <div className="border-b border-white/6 pb-5">
            <p className="text-sm font-medium text-zinc-300">
              Top referrers
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Where your traffic comes from.
            </p>
          </div>

          <div className="divide-y divide-white/5">
            {data.referrers.length === 0 ? (
              <p className="py-8 text-sm text-zinc-600">
                No referrer data yet.
              </p>
            ) : (
              data.referrers.slice(0, 6).map((referrer) => (
                <div
                  key={referrer.referrer}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <p className="truncate text-sm text-zinc-400">
                    {referrer.referrer}
                  </p>

                  <span className="shrink-0 text-xs text-zinc-600">
                    {Number(referrer.clicks).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/* -----------------------------
   Stat
----------------------------- */

function Stat({ label, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#09090b] p-6"
    >
      <p className="text-xs text-zinc-600">{label}</p>

      <p className="mt-3 text-3xl font-medium tracking-tight text-zinc-200">
        {Number(value).toLocaleString()}
      </p>
    </motion.div>
  );
}

/* -----------------------------
   Click Chart
----------------------------- */

function ClickChart({ data }) {
  if (!data.length) {
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

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxClicks = Math.max(
    ...data.map((item) => item.clicks),
    1
  );

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? paddingLeft + chartWidth / 2
        : paddingLeft +
          (index / (data.length - 1)) * chartWidth;

    const y =
      paddingTop +
      chartHeight -
      (item.clicks / maxClicks) * chartHeight;

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
    L ${points[0].x} ${paddingTop + chartHeight}
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
          {/* Grid */}
          {gridLines.map((ratio) => {
            const y =
              paddingTop + chartHeight * (1 - ratio);

            const value = Math.round(maxClicks * ratio);

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

                {/* Y-axis click numbers */}
                <text
                  x="0"
                  y={y + 4}
                  fill="rgba(255,255,255,0.22)"
                  fontSize="10"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Area */}
          <motion.path
            d={areaPath}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            fill="rgba(255,255,255,0.025)"
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="rgba(212,212,216,0.75)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />

          {/* Points */}
          {points.map((point) => (
            <g key={point.date.toISOString()}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#09090b"
                stroke="rgba(228,228,231,0.85)"
                strokeWidth="1.5"
              />

              <title>
                {formatDate(point.date)}: {point.clicks} clicks
              </title>
            </g>
          ))}

          {/* X-axis dates */}
          {getLabelIndexes(data.length).map((index) => {
            const point = points[index];

            return (
              <text
                key={index}
                x={point.x}
                y={height - 12}
                textAnchor="middle"
                fill="rgba(255,255,255,0.25)"
                fontSize="8"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {formatDate(point.date)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* -----------------------------
   Helpers
----------------------------- */

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function getLabelIndexes(length) {
  if (length <= 1) return [0];

  if (length <= 4) {
    return Array.from({ length }, (_, index) => index);
  }

  return [0, Math.floor(length / 2), length - 1];
}

/* -----------------------------
   Loading
----------------------------- */

function DashboardSkeleton() {
  return (
    <main className="w-full px-6 py-20 md:px-10 lg:px-12">
      <div className="h-3 w-24 animate-pulse bg-white/5" />

      <div className="mt-5 h-12 w-56 animate-pulse bg-white/5" />

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

export default Dashboard;