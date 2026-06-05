import { useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0)", "rgba(5,5,5,0.95)"],
  );
  const navBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.06)"],
  );

  return (
    <motion.nav
      style={{ backgroundColor: navBg, borderColor: navBorder }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center shrink-0">
            <Logo variant="horizontal" className="h-16 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="/#fitur"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Fitur
            </a>
            <a
              href="/#harga"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Harga
            </a>
            <Link
              to="/articles"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Artikel
            </Link>
            <Link
              to="/support"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Support
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/cms"
                className="flex items-center gap-2 text-sm font-bold bg-gold-gradient text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95"
              >
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-slate-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-bold bg-gold-gradient text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all active:scale-95"
                >
                  Coba Gratis
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-slate-400 hover:text-white p-2"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              <a
                href="/#fitur"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-slate-300 py-2"
              >
                Fitur
              </a>
              <a
                href="/#harga"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-slate-300 py-2"
              >
                Harga
              </a>
              <Link
                to="/articles"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-slate-300 py-2"
              >
                Artikel
              </Link>
              <Link
                to="/support"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-slate-300 py-2"
              >
                Support
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/cms"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-gold-gradient text-white text-sm font-bold py-3 rounded-xl mt-2"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-gold-gradient text-white text-sm font-bold py-3 rounded-xl mt-2"
                >
                  Mulai Gratis
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
