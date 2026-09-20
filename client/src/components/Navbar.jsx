import { motion } from "motion/react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const navClass = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive
        ? "text-zinc-200"
        : "text-zinc-500 hover:text-zinc-200"
    }`;

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border-b border-white/6"
    >
      <div className="flex h-16 items-center justify-between px-6 md:px-10">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-xs font-bold text-zinc-950">
            S
          </div>

          <span className="text-[15px] font-semibold tracking-tight text-zinc-200">
            Shortify
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink
            to="/"
            end
            className={navClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard"
            className={navClass}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/analytics"
            className={navClass}
          >
            Analytics
          </NavLink>
         <NavLink
  to="/links"
  className={navClass}
>
  My Links
</NavLink>
          <NavLink
            to="/api"
            className={navClass}
          >
            API
          </NavLink>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* GitHub */}
         <a
  href="https://github.com/amankumarpiyush04/shortify"
  target="_blank"
  rel="noopener noreferrer"
  className="hidden text-sm text-zinc-500 transition-colors hover:text-zinc-200 sm:block"
>
  GitHub
</a>

          {/* Authentication */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">

              <span className="hidden text-sm text-zinc-300 sm:block">
                {user?.name || user?.email || "User"}
              </span>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={logout}
                type="button"
                className="rounded-md border border-white/8 px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-white/[0.14] hover:bg-white/3 hover:text-zinc-200"
              >
                Logout
              </motion.button>

            </div>
          ) : (
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/login"
                className="block rounded-md border border-white/8 px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-white/[0.14] hover:bg-white/3 hover:text-zinc-200"
              >
                Sign In
              </Link>
            </motion.div>
          )}

        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;