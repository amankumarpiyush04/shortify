import { useState } from "react";
import { motion } from "motion/react";
import API_URL from "../utils/api";


const endpoints = [
  {
    id: "create",
    method: "POST",
    path: "/api/urls",
    title: "Create a short URL",
    description:
      "Create a shortened URL with an optional custom alias and expiration time.",
  },
  {
    id: "list",
    method: "GET",
    path: "/api/urls",
    title: "List recent URLs",
    description: "Retrieve recently created shortened URLs.",
  },
  {
    id: "overview",
    method: "GET",
    path: "/api/urls/analytics/overview",
    title: "Global analytics",
    description:
      "Retrieve aggregate analytics across all shortened URLs.",
  },
  {
    id: "analytics",
    method: "GET",
    path: "/api/urls/:id/analytics",
    title: "URL analytics",
    description: "Retrieve detailed analytics for a specific shortened URL.",
  },
  {
    id: "redirect",
    method: "GET",
    path: "/:shortCode",
    title: "Redirect",
    description:
      "Redirect a short code to its original URL and record the click.",
  },
];

const methodStyle = {
  POST: "text-emerald-400",
  GET: "text-zinc-400",
};

function CodeBlock({ children, copyText }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText || children);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#0d0d0f]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
          JSON
        </span>

        <button
          onClick={handleCopy}
          className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-zinc-400">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function MethodBadge({ method }) {
  return (
    <span
      className={`font-mono text-[11px] font-medium ${
        methodStyle[method] || "text-zinc-400"
      }`}
    >
      {method}
    </span>
  );
}

function ApiDocs() {
  const [activeEndpoint, setActiveEndpoint] = useState("create");

  const active = endpoints.find((endpoint) => endpoint.id === activeEndpoint);

  return (
    <main className="min-h-[calc(100vh-4rem)] px-6 py-12 md:px-10 lg:px-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-b border-white/[0.06] pb-10"
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
          Developer API
        </p>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-medium tracking-[-0.04em] text-zinc-100 md:text-5xl">
              Shortify API
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500">
              Programmatically create, manage and inspect shortened URLs
              through the Shortify API.
            </p>
          </div>

          <div className="w-fit border border-white/[0.07] bg-white/[0.02] px-3 py-2">
            <span className="mr-2 text-[10px] uppercase tracking-[0.12em] text-zinc-600">
              Base URL
            </span>

            <span className="font-mono text-xs text-zinc-400">
              {API_URL}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Endpoint navigation */}
        <aside className="border-b border-white/[0.06] py-8 lg:border-b-0 lg:border-r lg:pr-8">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
            Endpoints
          </p>

          <div className="space-y-1">
            {endpoints.map((endpoint) => {
              const isActive = endpoint.id === activeEndpoint;

              return (
                <button
                  key={endpoint.id}
                  onClick={() => setActiveEndpoint(endpoint.id)}
                  className={`group flex w-full items-center gap-3 border-l px-3 py-2.5 text-left transition-colors ${
                    isActive
                      ? "border-zinc-300 bg-white/[0.04]"
                      : "border-transparent hover:bg-white/[0.025]"
                  }`}
                >
                  <MethodBadge method={endpoint.method} />

                  <span
                    className={`truncate font-mono text-[11px] ${
                      isActive
                        ? "text-zinc-200"
                        : "text-zinc-600 group-hover:text-zinc-400"
                    }`}
                  >
                    {endpoint.path}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Endpoint content */}
        <section className="min-w-0 py-8 lg:pl-10">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Endpoint heading */}
            <div className="border-b border-white/[0.06] pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <MethodBadge method={active.method} />

                <span className="font-mono text-sm text-zinc-300">
                  {active.path}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-medium tracking-tight text-zinc-100">
                {active.title}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                {active.description}
              </p>
            </div>

            {/* CREATE */}
            {active.id === "create" && (
              <div className="space-y-10 pt-8">
                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Request body
                  </p>

                  <CodeBlock
                    copyText={`{
  "originalUrl": "https://example.com",
  "customAlias": "my-link",
  "expiresAt": "2026-10-01T12:00:00"
}`}
                  >
                    {`{
  "originalUrl": "https://example.com",
  "customAlias": "my-link",
  "expiresAt": "2026-10-01T12:00:00"
}`}
                  </CodeBlock>
                </div>

                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Fields
                  </p>

                  <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
                    <div className="grid gap-2 py-4 md:grid-cols-[160px_100px_1fr]">
                      <span className="font-mono text-xs text-zinc-300">
                        originalUrl
                      </span>
                      <span className="text-xs text-emerald-400">
                        required
                      </span>
                      <span className="text-xs leading-5 text-zinc-600">
                        The URL that should be shortened. HTTP and HTTPS are
                        supported.
                      </span>
                    </div>

                    <div className="grid gap-2 py-4 md:grid-cols-[160px_100px_1fr]">
                      <span className="font-mono text-xs text-zinc-300">
                        customAlias
                      </span>
                      <span className="text-xs text-zinc-600">optional</span>
                      <span className="text-xs leading-5 text-zinc-600">
                        A custom 3–20 character alias using letters, numbers,
                        hyphens or underscores.
                      </span>
                    </div>

                    <div className="grid gap-2 py-4 md:grid-cols-[160px_100px_1fr]">
                      <span className="font-mono text-xs text-zinc-300">
                        expiresAt
                      </span>
                      <span className="text-xs text-zinc-600">optional</span>
                      <span className="text-xs leading-5 text-zinc-600">
                        ISO date-time after which the shortened URL becomes
                        inactive.
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Response
                  </p>

                  <CodeBlock
                    copyText={`{
  "message": "URL shortened successfully",
  "data": {
    "id": 12,
    "original_url": "https://example.com",
    "short_code": "my-link",
    "short_url": "${API_URL}/my-link"
  }
}`}
                  >
                    {`{
  "message": "URL shortened successfully",
  "data": {
    "id": 12,
    "original_url": "https://example.com",
    "short_code": "my-link",
   "short_url": "${API_URL}/my-link"
  }
}`}
                  </CodeBlock>
                </div>

                <StatusCodes
                  codes={[
                    ["201", "URL created successfully"],
                    ["400", "Invalid URL, alias or expiration"],
                    ["409", "Custom alias already exists"],
                  ]}
                />
              </div>
            )}

            {/* LIST */}
            {active.id === "list" && (
              <div className="space-y-10 pt-8">
                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Request
                  </p>

                  <CodeBlock>{`GET ${API_URL}/api/urls`}</CodeBlock>
                </div>

                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Response
                  </p>

                  <CodeBlock
                    copyText={`[
  {
    "id": 12,
    "original_url": "https://example.com",
    "short_code": "my-link",
    "created_at": "2026-09-18T12:30:00.000Z",
    "expires_at": null,
    "click_count": 8,
    "is_active": true
  }
]`}
                  >
                    {`[
  {
    "id": 12,
    "original_url": "https://example.com",
    "short_code": "my-link",
    "created_at": "2026-09-18T12:30:00.000Z",
    "expires_at": null,
    "click_count": 8,
    "is_active": true
  }
]`}
                  </CodeBlock>
                </div>

                <StatusCodes
                  codes={[["200", "Recently created URLs returned successfully"]]}
                />
              </div>
            )}

            {/* OVERVIEW */}
            {active.id === "overview" && (
              <div className="space-y-10 pt-8">
                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Request
                  </p>

                  <CodeBlock>
                    {`GET ${API_URL}/api/urls/analytics/overview`}
                  </CodeBlock>
                </div>

                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Response
                  </p>

                  <CodeBlock
                    copyText={`{
  "totalUrls": 12,
  "totalClicks": 248,
  "activeUrls": 10,
  "expiredUrls": 2,
  "clicksOverTime": [],
  "topLinks": [],
  "referrers": [],
  "browsers": [],
  "operatingSystems": [],
  "devices": []
}`}
                  >
                    {`{
  "totalUrls": 12,
  "totalClicks": 248,
  "activeUrls": 10,
  "expiredUrls": 2,
  "clicksOverTime": [],
  "topLinks": [],
  "referrers": [],
  "browsers": [],
  "operatingSystems": [],
  "devices": []
}`}
                  </CodeBlock>
                </div>

                <StatusCodes
                  codes={[["200", "Analytics returned successfully"]]}
                />
              </div>
            )}

            {/* INDIVIDUAL ANALYTICS */}
            {active.id === "analytics" && (
              <div className="space-y-10 pt-8">
                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Path parameter
                  </p>

                  <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
                    <div className="grid gap-2 py-4 md:grid-cols-[160px_100px_1fr]">
                      <span className="font-mono text-xs text-zinc-300">
                        id
                      </span>
                      <span className="text-xs text-emerald-400">
                        required
                      </span>
                      <span className="text-xs text-zinc-600">
                        Database ID of the shortened URL.
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Request
                  </p>

                  <CodeBlock>
                    {`GET ${API_URL}/api/urls/12/analytics`}
                  </CodeBlock>
                </div>

                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Response
                  </p>

                  <CodeBlock
                    copyText={`{
  "url": {
    "id": 12,
    "original_url": "https://example.com",
    "short_code": "my-link",
    "click_count": 8,
    "is_active": true
  },
  "totalClicks": 8,
  "clicksOverTime": [],
  "referrers": [],
  "browsers": [],
  "operatingSystems": [],
  "devices": []
}`}
                  >
                    {`{
  "url": {
    "id": 12,
    "original_url": "https://example.com",
    "short_code": "my-link",
    "click_count": 8,
    "is_active": true
  },
  "totalClicks": 8,
  "clicksOverTime": [],
  "referrers": [],
  "browsers": [],
  "operatingSystems": [],
  "devices": []
}`}
                  </CodeBlock>
                </div>

                <StatusCodes
                  codes={[
                    ["200", "Analytics returned successfully"],
                    ["404", "Shortened URL not found"],
                  ]}
                />
              </div>
            )}

            {/* REDIRECT */}
            {active.id === "redirect" && (
              <div className="space-y-10 pt-8">
                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Request
                  </p>

                  <CodeBlock>{`GET ${API_URL}/my-link`}</CodeBlock>
                </div>

                <div>
                  <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Behaviour
                  </p>

                  <div className="border-y border-white/[0.06]">
                    <div className="grid gap-6 py-5 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-zinc-300">
                          1. Resolve
                        </p>
                        <p className="mt-1 text-xs leading-5 text-zinc-600">
                          Find the short code in PostgreSQL.
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-300">
                          2. Track
                        </p>
                        <p className="mt-1 text-xs leading-5 text-zinc-600">
                          Record click metadata and increment the counter.
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-zinc-300">
                          3. Redirect
                        </p>
                        <p className="mt-1 text-xs leading-5 text-zinc-600">
                          Redirect the visitor to the original URL.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <StatusCodes
                  codes={[
                    ["302", "Redirect to original URL"],
                    ["404", "Short code not found"],
                    ["410", "Short URL expired or inactive"],
                  ]}
                />
              </div>
            )}
          </motion.div>
        </section>
      </div>
    </main>
  );
}

function StatusCodes({ codes }) {
  return (
    <div>
      <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-zinc-600">
        Status codes
      </p>

      <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {codes.map(([code, description]) => (
          <div key={code} className="flex items-center gap-5 py-3.5">
            <span className="w-10 font-mono text-xs text-zinc-300">
              {code}
            </span>

            <span className="text-xs text-zinc-600">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApiDocs;