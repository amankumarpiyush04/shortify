import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import Hero from "../components/Hero";

const API_URL = "http://localhost:5000";

function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const { isAuthenticated } = useAuth();
  const [recentUrls, setRecentUrls] = useState([]);
  const [urlsLoading, setUrlsLoading] = useState(true);

  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Fetch recent URLs on page load
  useEffect(() => {
  const fetchRecentUrls = async () => {
    if (!isAuthenticated) {
      setRecentUrls([]);
      setUrlsLoading(false);
      return;
    }

    try {
      const response = await apiFetch("/api/urls");

      if (!response.ok) {
        throw new Error("Failed to fetch URLs");
      }

      const data = await response.json();
      setRecentUrls(data);
    } catch (error) {
      console.error("Recent URLs error:", error);
    } finally {
      setUrlsLoading(false);
    }
  };

  fetchRecentUrls();
}, [isAuthenticated]);
  // Shorten URL
  const handleShorten = async (e) => {
  e.preventDefault();

  console.log("SHORTEN FIRED");
  console.log("URL:", originalUrl);

  if (!originalUrl.trim()) {
    console.log("EMPTY URL");
    return;
  }

    setLoading(true);
    setError("");
    setShortUrl("");
    setCopied(false);

    try {
      console.log(
  "TOKEN BEFORE SHORTEN:",
  localStorage.getItem("shortify_token")
);
      const response = await apiFetch("/api/urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("shortify_token")}`
        },
        body: JSON.stringify({
          originalUrl,
          customAlias: customAlias || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to shorten URL");
      }

      setShortUrl(data.shortUrl);

      // Refresh recent links
      if (isAuthenticated) {
  const urlsResponse = await apiFetch("/api/urls");

  if (urlsResponse.ok) {
    const urls = await urlsResponse.json();
    setRecentUrls(urls);
  }
}
      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Copy URL
  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);

      setCopied(url);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <main className="w-full">
      {/* Hero */}
      <Hero
        originalUrl={originalUrl}
        setOriginalUrl={setOriginalUrl}
        shortenUrl={handleShorten}
        loading={loading}
      />

      {/* Options + Result */}
      <section className="w-full border-b border-white/6">
        <div className="w-full px-6 py-10 md:px-10 lg:px-12">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            
            {/* Options */}
            <div className="min-w-0">
              <div className="mb-5">
                <p className="text-sm font-medium text-zinc-300">
                  Options
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Customize the link if you need more control.
                </p>
              </div>

              <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
                {/* Custom alias */}
                <div>
                  <label className="mb-2 block text-xs text-zinc-600">
                    Custom alias
                  </label>

                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-link"
                    maxLength={20}
                    className="h-11 w-full rounded-lg border border-white/[0.07] bg-[#0e0e10] px-3.5 text-sm text-zinc-200 outline-none transition-colors duration-200 placeholder:text-zinc-700 focus:border-white/18"
                  />
                </div>

                {/* Expiration */}
                <div>
                  <label className="mb-2 block text-xs text-zinc-600">
                    Expiration
                  </label>

                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="h-11 w-full rounded-lg border border-white/[0.07] bg-[#0e0e10] px-3.5 text-sm text-zinc-400 outline-none transition-colors duration-200 focus:border-white/18"
                  />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="mt-4 text-sm text-red-400"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Result */}
            <div className="min-w-0 lg:border-l lg:border-white/6 lg:pl-8">
              <AnimatePresence mode="wait">
                {shortUrl ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-xs text-zinc-600">
                      Short URL
                    </p>

                    <p className="mt-2 break-all text-sm font-medium text-emerald-400">
                      {shortUrl}
                    </p>

                    <motion.button
                      type="button"
                      onClick={() => handleCopy(shortUrl)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 rounded-md border border-white/8 px-3 py-2 text-xs text-zinc-400 transition-colors hover:border-white/15 hover:bg-white/3 hover:text-zinc-200"
                    >
                      {copied === shortUrl ? "✓ Copied" : "Copy link"}
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="hidden lg:block">
                    <p className="text-xs leading-5 text-zinc-700">
                      Your shortened link
                      <br />
                      will appear here.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Links */}
      <section className="w-full">
        <div className="w-full px-6 pb-24 pt-12 md:px-10 lg:px-12">
          
          <div className="w-full overflow-hidden border-y border-white/6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/6 py-5">
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Recent links
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Your latest shortened URLs
                </p>
              </div>

              <button
                type="button"
                className="text-xs text-zinc-600 transition-colors hover:text-zinc-300"
              >
                View all
              </button>
            </div>

            {/* Link rows */}
            <div className="divide-y divide-white/5">
              {urlsLoading ? (
                <div className="py-12 text-center">
                  <div className="mx-auto h-4 w-4 animate-spin rounded-full border border-white/10 border-t-zinc-400" />

                  <p className="mt-3 text-xs text-zinc-600">
                    Loading links...
                  </p>
                </div>
              ) : recentUrls.length === 0 ? (
                <div className="py-12">
                  <p className="text-sm text-zinc-500">
                    No links yet.
                  </p>

                  <p className="mt-1 text-xs text-zinc-700">
                    Create your first short link above.
                  </p>
                </div>
              ) : (
                recentUrls.map((link, index) => {
                  const fullShortUrl = `${API_URL}/${link.short_code}`;

                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.25,
                        delay: index * 0.04,
                      }}
                      className="group flex w-full min-w-0 flex-col gap-4 py-5 transition-colors hover:bg-white/1.5 sm:px-3 md:flex-row md:items-center md:justify-between"
                    >
                      {/* Link information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/70" />

                          <p className="truncate text-sm font-medium text-zinc-300 transition-colors group-hover:text-zinc-100">
                            {fullShortUrl}
                          </p>
                        </div>

                        <p className="mt-1 truncate pl-3.5 text-xs text-zinc-700">
                          {link.original_url}
                        </p>
                      </div>

                      {/* Clicks + Copy */}
                      <div className="flex shrink-0 items-center gap-5 pl-3.5 sm:pl-0">
                        <div className="min-w-13.75">
                          <p className="text-sm text-zinc-400">
                            {link.click_count}
                          </p>

                          <p className="mt-0.5 text-[10px] uppercase tracking-wide text-zinc-700">
                            clicks
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(fullShortUrl)}
                          className="rounded-md border border-white/[0.07] px-3 py-1.5 text-xs text-zinc-600 transition-all hover:border-white/[0.14] hover:bg-white/3 hover:text-zinc-300 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          {copied === fullShortUrl ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;