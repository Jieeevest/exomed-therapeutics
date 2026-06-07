import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/store/useLanguage";
import { tr } from "@/lib/i18n";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang } = useLanguage();
  const t = (key: string) => tr(lang, key);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#050505] border-b border-black/[0.06] dark:border-white/[0.06] shadow-sm dark:shadow-none">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <Logo variant="horizontal" className="h-16 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-slate-400">
          <a
            href="/#tentang"
            className="px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all"
          >
            {t("nav.about")}
          </a>
          <a
            href="/#produk"
            className="px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all"
          >
            {t("nav.products")}
          </a>
          <a
            href="/#riset"
            className="px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all"
          >
            {t("nav.research")}
          </a>
          <div className="w-px h-5 bg-black/[0.10] dark:bg-white/[0.10] mx-1" />
          <LanguageSelector />
          <ThemeToggle />
          <a
            href="/#kontak"
            className="ms-1 px-5 py-2 bg-gold-gradient text-white rounded-xl hover:opacity-90 transition-opacity font-bold"
          >
            {t("nav.consultation")}
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <LanguageSelector />
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#050505] overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              <a
                href="/#tentang"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-600 dark:text-slate-300 py-2 hover:text-gray-900 dark:hover:text-white"
              >
                {t("nav.about")}
              </a>
              <a
                href="/#produk"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-600 dark:text-slate-300 py-2 hover:text-gray-900 dark:hover:text-white"
              >
                {t("nav.products")}
              </a>
              <a
                href="/#riset"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-600 dark:text-slate-300 py-2 hover:text-gray-900 dark:hover:text-white"
              >
                {t("nav.research")}
              </a>
              <a
                href="/#kontak"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-gold-gradient text-white text-sm font-bold py-3 rounded-xl mt-2"
              >
                {t("nav.consultation")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
