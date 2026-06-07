import { useEffect, useRef, useState } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  CheckCircle,
  Download,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Microscope,
  Dna,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSelector } from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/store/useLanguage";
import { tr } from "@/lib/i18n";
import { API_URLS } from "@/constants/apiUrls";

// ── Static Data ───────────────────────────────────────────────────────────────

const AMNIOTIC_PRODUCTS = [
  {
    name: "ExoTher 1",
    nanoparticles: "1 Billion Nanoparticles",
    type: "MSC Amniotic Derived",
    description: "Optimal concentration for dermatology, aesthetic medicine, and hair restoration.",
  },
  {
    name: "ExoPro",
    nanoparticles: "300 Billion Nanoparticles",
    type: "MSC Amniotic Derived",
    description: "Professional-grade high-concentration formulation for advanced clinical cases.",
  },
  {
    name: "ExoMatrix",
    nanoparticles: "1.5 Trillion Nanoparticles",
    type: "MSC Amniotic Derived — Special Order",
    description: "Ultra-high concentration formulation. Available as special order under full medical supervision.",
  },
];

const PLACENTAL_PRODUCTS = [
  {
    name: "ExoLite",
    nanoparticles: "750 Billion Nanoparticles",
    type: "Placental Cord MSC",
    description: "Standard Placental Cord formulation for aesthetic and dermatology applications.",
  },
  {
    name: "ExoGen",
    nanoparticles: "1.5 Trillion Nanoparticles",
    type: "Placental Cord MSC — Special Order",
    description: "Ultra-high concentration Placental Cord formulation. Available as special order under full medical supervision.",
  },
];

const CLINICAL_AREAS = [
  { filled: true,  nameKey: "areas.1.name", catKey: "areas.1.cat", descKey: "areas.1.desc" },
  { filled: true,  nameKey: "areas.2.name", catKey: "areas.2.cat", descKey: "areas.2.desc" },
  { filled: true,  nameKey: "areas.3.name", catKey: "areas.3.cat", descKey: "areas.3.desc" },
  { filled: false, nameKey: "areas.4.name", catKey: "areas.4.cat", descKey: "areas.4.desc" },
  { filled: true,  nameKey: "areas.5.name", catKey: "areas.5.cat", descKey: "areas.5.desc" },
  { filled: true,  nameKey: "areas.6.name", catKey: "areas.6.cat", descKey: "areas.6.desc" },
  { filled: true,  nameKey: "areas.7.name", catKey: "areas.7.cat", descKey: "areas.7.desc" },
  { filled: false, nameKey: "areas.8.name", catKey: "areas.8.cat", descKey: "areas.8.desc" },
];

const CASE_STUDIES = [
  {
    specialtyKey: "cases.1.spec",
    title: "Facial Tics & Involuntary Movement",
    description: "Patient with facial tics (involuntary movement) and pain.",
    images: [
      { src: "/case-images/facial-tics-pre.jpg", caption: "Pretreatment" },
      { src: "/case-images/facial-tics-20s.jpg", caption: "20 sec post treatment" },
      { src: "/case-images/facial-tics-3w.jpg", caption: "3rd visit (3 weeks)" },
    ],
    metrics: [
      { label: "Initial response — immediate tic reduction", value: "20 seconds" },
      { label: "3rd visit — sustained resolution, no pain reported", value: "3 weeks" },
    ],
  },
  {
    specialtyKey: "cases.2.spec",
    title: "Severe Psoriasis — Full Body Coverage",
    description: "37-year-old patient · >95% BSA affected · Treatment: ExoTher 1 Billion Nanoparticles.",
    images: [
      { src: "/case-images/psoriasis-pre.jpg", caption: "Pre-treatment" },
      { src: "/case-images/psoriasis-post.jpg", caption: "2 Weeks Post-treatment" },
    ],
    metrics: [
      { label: "Body surface area affected pre-treatment", value: ">95% BSA" },
      { label: "Near-complete skin clearance post ExoTher", value: "2 Weeks" },
    ],
  },
  {
    specialtyKey: "cases.3.spec",
    title: "Hemorrhagic Stroke Recovery",
    description: "Wheelchair-bound patient with lower limb paralysis — 2-month exosome treatment protocol.",
    images: [
      { src: "/case-images/stroke-pre.jpg", caption: "Pre-treatment" },
      { src: "/case-images/stroke-post.jpg", caption: "2 Months Post-treatment" },
    ],
    metrics: [
      { label: "Treatment duration to ambulation", value: "2 Months" },
      { label: "Patient walking with cane support post-treatment", value: "Ambulatory" },
    ],
  },
  {
    specialtyKey: "cases.4.spec",
    title: "Knee Osteoarthritis (OA)",
    description: "Radiographic joint space increase at 1 month · VRS pain scale near-zero at 6 months.",
    images: [
      { src: "/case-images/oa-before.jpg", caption: "Before" },
      { src: "/case-images/oa-after.jpg", caption: "After 1 Month" },
    ],
    metrics: [
      { label: "Visible joint space increase on X-ray", value: "1 Month" },
      { label: "Pain-free at rest & activity — sustained to 6 months", value: "VRS Score 0" },
    ],
  },
  {
    specialtyKey: "cases.5.spec",
    title: "Cerebral Palsy — Pediatric Case",
    description: "Patient Syamil — Improvement in sitting endurance and core strength from Day 3.",
    images: [
      { src: "/case-images/cp-syamil.jpg", caption: "Patient Syamil" },
    ],
    metrics: [
      { label: "Day 3", value: "Sitting endurance improved — from 5 min to sustained periods without fatigue" },
      { label: "Motor", value: "Visible core muscle activation improvement; physical therapy ongoing alongside treatment" },
      { label: "Neurological", value: "No severe headache episodes reported through observation period" },
      { label: "Adverse Events", value: "Mild transient facial rash noted — self-resolving, non-distressing" },
    ],
  },
];

const PIPELINE = [
  {
    product: "ExoMatrix",
    platform: "Neurological Platform",
    stage: "pre-clinical" as const,
  },
  {
    product: "ExoTher 3",
    platform: "Orthopedic Platform",
    stage: "research" as const,
  },
  {
    product: "ExoGen",
    platform: "Dermatology Platform",
    stage: "special-order" as const,
  },
  {
    product: "ExoPro",
    platform: "Aesthetic Platform",
    stage: "early-research" as const,
  },
];

const STAGE_STYLE: Record<string, string> = {
  "pre-clinical":
    "text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  research:
    "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  "special-order":
    "text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  "early-research":
    "text-slate-500 dark:text-slate-400 bg-black/[0.04] dark:bg-slate-500/10 border-black/[0.08] dark:border-slate-500/20",
};

const STAGE_LABELS: Record<string, string> = {
  "pre-clinical": "Pre-Clinical",
  research: "Research",
  "special-order": "Special Order",
  "early-research": "Early Research",
};

const WA_NUMBER = "6281234567890";
const WA_DEFAULT =
  "Halo Exomed, saya ingin berkonsultasi mengenai produk exosome untuk klinik saya.";

// ── Component ─────────────────────────────────────────────────────────────────

export default function Landing() {
  const { lang } = useLanguage();
  const t = (key: string) => tr(lang, key);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"amniotic" | "placental">(
    "amniotic",
  );
  const [coaModal, setCoaModal] = useState(false);
  const [coaForm, setCoaForm] = useState({ name: "", email: "" });
  const [coaDone, setCoaDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    clinic: "",
    city: "",
    whatsapp: "",
    product_interest: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  const [caseDir, setCaseDir] = useState(1);

  const { scrollY } = useScroll();
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 80));
    return unsub;
  }, [scrollY]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(API_URLS.cms.inquirySubmit, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // backend may not be ready yet
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white overflow-x-hidden">
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-black/[0.06] dark:border-white/[0.06] shadow-sm dark:shadow-none"
            : "bg-transparent border-transparent",
        )}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo className="h-16 w-auto" variant="horizontal" />

          <div className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-slate-400">
            <a
              href="#tentang"
              className="px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all"
            >
              {t("nav.about")}
            </a>
            <a
              href="#produk"
              className="px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all"
            >
              {t("nav.products")}
            </a>
            <a
              href="#riset"
              className="px-3 py-2 rounded-xl hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all"
            >
              {t("nav.research")}
            </a>
            <div className="w-px h-5 bg-black/[0.10] dark:bg-white/[0.10] mx-1" />
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={scrollToForm}
              className="ms-1 px-5 py-2 bg-gold-gradient text-white rounded-xl hover:opacity-90 transition-opacity font-bold"
            >
              {t("nav.consultation")}
            </button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <LanguageSelector />
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/98 dark:bg-black/95 backdrop-blur-xl flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <Logo className="h-16 w-auto" variant="horizontal" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-gray-500 dark:text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-4 text-2xl font-black">
              <a
                href="#tentang"
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
              >
                {t("nav.about")}
              </a>
              <a
                href="#produk"
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
              >
                {t("nav.products")}
              </a>
              <a
                href="#riset"
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
              >
                {t("nav.research")}
              </a>
              <button
                onClick={scrollToForm}
                className="text-start text-primary"
              >
                {t("nav.consultation")} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.05] rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {(
              [
                t("hero.badge.usa"),
                t("hero.badge.fda"),
                t("hero.badge.pro"),
              ] as string[]
            ).map((badge) => (
              <span
                key={badge}
                className="px-3 py-1.5 text-xs font-bold bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-full text-gray-500 dark:text-slate-400 tracking-wide"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-2"
          >
            {t("hero.headline")}
          </motion.h1>
          <div className="w-16 h-1 bg-gold-gradient rounded-full mb-4" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-gray-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            {t("hero.subtext")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold-gradient text-white font-black rounded-2xl hover:opacity-90 transition-opacity text-base shadow-[0_0_40px_rgba(78,130,129,0.15)]"
            >
              {t("hero.cta")}
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_DEFAULT)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black/[0.05] dark:bg-white/[0.06] border border-black/[0.10] dark:border-white/[0.10] text-gray-700 dark:text-white font-bold rounded-2xl hover:bg-black/[0.09] dark:hover:bg-white/[0.10] transition-colors text-base"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Tentang Exomed ──────────────────────────────────────────────────── */}
      <section
        id="tentang"
        className="py-24 px-6 border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">
                {t("about.label")}
              </p>
              <h2 className="text-4xl font-black leading-tight mb-6">
                {t("about.title")}
              </h2>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                {t("about.body1")}
              </p>
              <p className="text-gray-500 dark:text-slate-400 leading-relaxed">
                {t("about.body2")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  icon: Shield,
                  lk: "about.cred1.label",
                  sk: "about.cred1.sub",
                },
                { icon: Award, lk: "about.cred2.label", sk: "about.cred2.sub" },
                {
                  icon: CheckCircle,
                  lk: "about.cred3.label",
                  sk: "about.cred3.sub",
                },
              ].map((item) => (
                <div
                  key={item.lk}
                  className="flex items-start gap-4 p-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.07] dark:border-white/[0.06] rounded-2xl"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t(item.lk)}</div>
                    <div className="text-sm text-gray-500 dark:text-slate-500 mt-0.5">
                      {t(item.sk)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mengapa Exosome ─────────────────────────────────────────────────── */}
      <section
        id="riset"
        className="py-24 px-6 bg-black/[0.015] dark:bg-white/[0.01] border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("why.label")}
            </p>
            <h2 className="text-4xl font-black">{t("why.title")}</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-xl mx-auto text-base leading-relaxed">
              {t("why.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Dna, tk: "why.card1.title", bk: "why.card1.body" },
              { icon: Microscope, tk: "why.card2.title", bk: "why.card2.body" },
              { icon: Zap, tk: "why.card3.title", bk: "why.card3.body" },
            ].map((item) => (
              <div
                key={item.tk}
                className="p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.07] dark:border-white/[0.06] rounded-2xl hover:border-primary/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-black text-base mb-3">{t(item.tk)}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  {t(item.bk)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Area Aplikasi ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-5">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("areas.label")}
            </p>
            <h2 className="text-4xl font-black">{t("areas.title")}</h2>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-slate-500 border border-black/[0.07] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] rounded-xl px-4 py-2.5 max-w-xl mx-auto mb-10">
            {t("areas.disclaimer")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CLINICAL_AREAS.map((area) => (
              <div
                key={area.nameKey}
                className="p-5 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.07] dark:border-white/[0.06] rounded-2xl hover:border-black/[0.14] dark:hover:border-white/[0.12] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all cursor-default"
              >
                {area.filled
                  ? <div className="w-2.5 h-2.5 bg-primary rotate-45 mb-4" />
                  : <div className="w-2.5 h-2.5 border-2 border-primary/50 rounded-full mb-4" />
                }
                <div className="font-black text-base mb-1">{t(area.nameKey)}</div>
                <div className="text-xs font-bold text-primary/70 uppercase tracking-wider mb-2">
                  {t(area.catKey)}
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-500 leading-snug">
                  {t(area.descKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produk ──────────────────────────────────────────────────────────── */}
      <section
        id="produk"
        className="py-24 px-6 bg-black/[0.015] dark:bg-white/[0.01] border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("products.label")}
            </p>
            <h2 className="text-4xl font-black">{t("products.title")}</h2>
            <p className="text-base text-gray-500 dark:text-slate-400 mt-3 max-w-lg mx-auto">
              {t("products.subtitle")}
            </p>
          </div>

          <div className="flex gap-2 mb-8 bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-1.5 max-w-sm mx-auto">
            {(["amniotic", "placental"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-xl transition-all",
                  activeTab === tab
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(78,130,129,0.2)]"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white",
                )}
              >
                {t(
                  tab === "amniotic"
                    ? "products.tab.amniotic"
                    : "products.tab.placental",
                )}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {(activeTab === "amniotic"
              ? AMNIOTIC_PRODUCTS
              : PLACENTAL_PRODUCTS
            ).map((product) => (
              <div
                key={product.name}
                className="p-6 bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl hover:border-primary/20 transition-colors flex flex-col"
              >
                <div className="text-xs font-black text-primary uppercase tracking-widest mb-2">
                  {t(
                    activeTab === "amniotic"
                      ? "products.tab.amniotic"
                      : "products.tab.placental",
                  )}
                </div>
                <h3 className="font-black text-lg mb-1">{product.name}</h3>
                <div className="text-sm font-bold text-gray-600 dark:text-slate-300 mb-1">
                  {product.nanoparticles}
                </div>
                <div className="text-sm text-gray-400 dark:text-slate-500 font-semibold mb-3">
                  {product.type}
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed flex-1">
                  {product.description}
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo Exomed, saya ingin menanyakan produk ${product.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.10] dark:border-white/[0.10] rounded-xl text-sm font-bold hover:bg-black/[0.08] dark:hover:bg-white/[0.09] transition-colors text-gray-700 dark:text-white"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {t("products.cta")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Studi Kasus ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("cases.label")}
            </p>
            <h2 className="text-4xl font-black">{t("cases.title")}</h2>
          </div>
          <div className="flex items-start gap-3 p-4 mb-10 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl max-w-3xl mx-auto">
            <Shield className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300/80 leading-relaxed">
              {t("cases.disclaimer")}
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={caseDir}>
                <motion.div
                  key={caseIndex}
                  custom={caseDir}
                  initial={{ opacity: 0, x: caseDir * 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: caseDir * -80 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.07] dark:border-white/[0.06] rounded-2xl overflow-hidden max-w-2xl mx-auto"
                >
                  {(() => {
                    const cs = CASE_STUDIES[caseIndex];
                    return (
                      <>
                        {cs.images && cs.images.length > 0 && (
                          <div className={cn(
                            "grid gap-0.5",
                            cs.images.length === 1 ? "grid-cols-1" :
                            cs.images.length === 2 ? "grid-cols-2" : "grid-cols-3"
                          )}>
                            {cs.images.map((img) => (
                              <div key={img.src} className="relative aspect-[4/3] bg-black/[0.06] dark:bg-white/[0.04] overflow-hidden">
                                <img
                                  src={img.src}
                                  alt={img.caption}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                                />
                                <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1">
                                  <span className="text-[10px] text-white/80 font-medium">{img.caption}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="p-6">
                          <span className="text-xs font-black uppercase tracking-widest text-primary">
                            {t(cs.specialtyKey)}
                          </span>
                          <h3 className="font-black text-base mt-2 mb-3 leading-snug">
                            {cs.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-slate-500 leading-relaxed mb-5">
                            {cs.description}
                          </p>
                          <div className="space-y-2">
                            {cs.metrics.map((m) => (
                              <div
                                key={m.label}
                                className="flex justify-between items-start gap-3 py-2 border-t border-black/[0.06] dark:border-white/[0.06]"
                              >
                                <span className="text-sm text-gray-500 dark:text-slate-400 shrink-0">
                                  {m.label}
                                </span>
                                <span className="text-sm font-black text-gray-900 dark:text-white text-right">
                                  {m.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => { setCaseDir(-1); setCaseIndex((i) => (i - 1 + CASE_STUDIES.length) % CASE_STUDIES.length); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.10] flex items-center justify-center shadow-sm hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-slate-300" />
            </button>
            <button
              onClick={() => { setCaseDir(1); setCaseIndex((i) => (i + 1) % CASE_STUDIES.length); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.10] flex items-center justify-center shadow-sm hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-slate-300" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {CASE_STUDIES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCaseDir(i > caseIndex ? 1 : -1); setCaseIndex(i); }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === caseIndex
                    ? "bg-primary w-6"
                    : "bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Kepatuhan & Sertifikasi ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-black/[0.015] dark:bg-white/[0.01] border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("compliance.label")}
            </p>
            <h2 className="text-4xl font-black">{t("compliance.title")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                icon: Shield,
                lk: "compliance.cert1.label",
                sk: "compliance.cert1.sub",
              },
              {
                icon: Award,
                lk: "compliance.cert2.label",
                sk: "compliance.cert2.sub",
              },
              {
                icon: CheckCircle,
                lk: "compliance.cert3.label",
                sk: "compliance.cert3.sub",
              },
              {
                icon: Microscope,
                lk: "compliance.cert4.label",
                sk: "compliance.cert4.sub",
              },
            ].map((item) => (
              <div
                key={item.lk}
                className="p-5 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.07] dark:border-white/[0.06] rounded-2xl text-center"
              >
                <item.icon className="w-7 h-7 text-primary mx-auto mb-3" />
                <div className="font-black text-base mb-1">{t(item.lk)}</div>
                <div className="text-sm text-gray-500 dark:text-slate-500">
                  {t(item.sk)}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => {
                setCoaModal(true);
                setCoaDone(false);
                setCoaForm({ name: "", email: "" });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.10] dark:border-white/[0.10] text-gray-700 dark:text-white font-bold rounded-xl hover:bg-black/[0.08] dark:hover:bg-white/[0.09] transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              {t("compliance.download")}
            </button>
            <p className="text-xs text-gray-400 dark:text-slate-600 mt-2">
              {t("compliance.download.hint")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Pipeline ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("pipeline.label")}
            </p>
            <h2 className="text-4xl font-black">{t("pipeline.title")}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/[0.08] dark:border-white/[0.08]">
                  {[
                    t("pipeline.col.product"),
                    t("pipeline.col.platform"),
                    t("pipeline.col.stage"),
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-start py-3 px-4 text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                {PIPELINE.map((item) => (
                  <tr
                    key={item.product}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4 font-black">{item.product}</td>
                    <td className="py-4 px-4 text-gray-500 dark:text-slate-400">
                      {item.platform}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border",
                          STAGE_STYLE[item.stage],
                        )}
                      >
                        {STAGE_LABELS[item.stage]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Form Konsultasi ─────────────────────────────────────────────────── */}
      <section
        ref={formRef}
        id="konsultasi"
        className="py-24 px-6 bg-black/[0.015] dark:bg-white/[0.01] border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("form.label")}
            </p>
            <h2 className="text-4xl font-black">{t("form.title")}</h2>
            <p className="text-base text-gray-500 dark:text-slate-400 mt-3">
              {t("form.subtitle")}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-8 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl"
              >
                <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-black mb-2">
                  {t("form.success.title")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                  {t("form.success.body")}
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_DEFAULT)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.10] dark:border-white/[0.10] rounded-xl text-sm font-bold hover:bg-black/[0.08] dark:hover:bg-white/[0.10] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {t("form.success.wa")}
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label={t("form.name")}
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    placeholder={t("form.name.ph")}
                  />
                  <Field
                    label={t("form.specialty")}
                    name="specialty"
                    value={form.specialty}
                    onChange={handleFormChange}
                    required
                    placeholder={t("form.specialty.ph")}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label={t("form.clinic")}
                    name="clinic"
                    value={form.clinic}
                    onChange={handleFormChange}
                    required
                    placeholder={t("form.clinic.ph")}
                  />
                  <Field
                    label={t("form.city")}
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    required
                    placeholder={t("form.city.ph")}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field
                    label={t("form.wa")}
                    name="whatsapp"
                    value={form.whatsapp}
                    onChange={handleFormChange}
                    required
                    placeholder={t("form.wa.ph")}
                    type="tel"
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500">
                      {t("form.product")}
                    </label>
                    <select
                      name="product_interest"
                      value={form.product_interest}
                      onChange={handleFormChange}
                      required
                      className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-2xl px-4 py-3.5 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                    >
                      <option value="">{t("form.product.ph")}</option>
                      <optgroup label="Amniotic Series">
                        <option value="ExoMed 1">ExoMed 1 — 200M Nanoparticles (with HA)</option>
                        <option value="ExoMed 2">ExoMed 2 — 1B Nanoparticles (with HA)</option>
                        <option value="ExoTher">ExoTher — 200M Nanoparticles</option>
                        <option value="ExoTher 1">ExoTher 1 — 1B Nanoparticles</option>
                        <option value="ExoTher 2">ExoTher 2 — 10B Nanoparticles</option>
                        <option value="ExoTher 3">ExoTher 3 — 100B Nanoparticles</option>
                        <option value="ExoPro">ExoPro — 300B Nanoparticles</option>
                        <option value="ExoFit">ExoFit — 750B Nanoparticles</option>
                        <option value="ExoMatrix">ExoMatrix — 1.5T Nanoparticles (Special Order)</option>
                      </optgroup>
                      <optgroup label="Placental Cord Series">
                        <option value="ExoLite">ExoLite — 750B Nanoparticles</option>
                        <option value="ExoGen">ExoGen — 1.5T Nanoparticles (Special Order)</option>
                      </optgroup>
                      <option value="unknown">
                        {t("form.product.unknown")}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500">
                    {t("form.message")}
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleFormChange}
                    rows={4}
                    placeholder={t("form.message.ph")}
                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-2xl px-4 py-3.5 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-white/20"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold-gradient text-white font-black rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? t("form.submitting") : t("form.submit")}
                    {!submitting && <ChevronRight className="w-4 h-4" />}
                  </button>
                  <a
                    href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_DEFAULT)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.10] dark:border-white/[0.10] text-gray-700 dark:text-white font-bold rounded-2xl hover:bg-black/[0.08] dark:hover:bg-white/[0.09] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {t("form.wa.direct")}
                  </a>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-black/[0.06] dark:border-white/[0.06] py-14 px-6 bg-gray-50 dark:bg-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <Logo className="h-14 w-auto mb-4" variant="horizontal" />
              <p className="text-xs text-gray-500 dark:text-slate-500 leading-relaxed">
                {t("footer.about")}
              </p>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-600 mb-4">
                {t("footer.contact")}
              </div>
              <div className="space-y-2">
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-primary" /> WhatsApp
                  Business
                </a>
                <a
                  href="mailto:info@exomed.id"
                  className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" /> info@exomed.id
                </a>
                <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />{" "}
                  Jakarta, Indonesia
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-600 mb-4">
                {t("footer.legal")}
              </div>
              <div className="space-y-2">
                <a
                  href="/page/privacy"
                  className="block text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t("footer.privacy")}
                </a>
                <a
                  href="/page/terms"
                  className="block text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t("footer.terms")}
                </a>
                <a
                  href="/page/disclaimer"
                  className="block text-sm text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t("footer.disclaimer.link")}
                </a>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-black/[0.05] dark:border-white/[0.05] flex flex-col md:flex-row justify-between gap-3 text-xs text-gray-400 dark:text-slate-600">
            <p>
              © {new Date().getFullYear()} Exomed Therapeutics Indonesia. All
              rights reserved.
            </p>
            <p className="font-bold uppercase tracking-wider">
              {t("footer.professional")}
            </p>
          </div>
        </div>
      </footer>

      {/* ── COA Modal ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {coaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setCoaModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white dark:bg-[#0a0a0a] border border-black/[0.10] dark:border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl"
            >
              {coaDone ? (
                <div className="text-center">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-black text-lg mb-2">
                    {t("coa.success.title")}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                    {t("coa.success.body")}
                  </p>
                  <button
                    onClick={() => setCoaModal(false)}
                    className="px-6 py-2.5 bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.10] dark:border-white/[0.10] rounded-xl text-sm font-bold hover:bg-black/[0.08] dark:hover:bg-white/[0.10] transition-colors"
                  >
                    {t("coa.success.close")}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-lg">{t("coa.title")}</h3>
                    <button
                      onClick={() => setCoaModal(false)}
                      className="text-gray-400 hover:text-gray-900 dark:text-slate-500 dark:hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
                    {t("coa.body")}
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCoaDone(true);
                    }}
                    className="space-y-4"
                  >
                    <ModalField
                      label={t("coa.name")}
                      value={coaForm.name}
                      onChange={(v) => setCoaForm((p) => ({ ...p, name: v }))}
                      placeholder={t("coa.name.ph")}
                    />
                    <ModalField
                      label={t("coa.email")}
                      type="email"
                      value={coaForm.email}
                      onChange={(v) => setCoaForm((p) => ({ ...p, email: v }))}
                      placeholder={t("coa.email.ph")}
                    />
                    <button
                      type="submit"
                      className="w-full py-3 bg-gold-gradient text-white font-black rounded-xl hover:opacity-90 transition-opacity text-sm mt-2"
                    >
                      {t("coa.submit")}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Field helpers ─────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-2xl px-4 py-3.5 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20"
      />
    </div>
  );
}

function ModalField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-slate-500">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-100 dark:bg-[#111] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all placeholder:text-gray-400 dark:placeholder:text-white/20"
      />
    </div>
  );
}
