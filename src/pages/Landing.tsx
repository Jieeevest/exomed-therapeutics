import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  STAGE_STYLE,
  STAGE_LABELS,
  WA_NUMBER,
  WA_DEFAULT,
  type LandingProduct,
  type LandingArea,
  type LandingCaseStudy,
  type LandingPipelineItem,
} from "@/constants/landingStatic";
import { usePageLoader } from "@/store/usePageLoader";
import { SectionEmpty } from "@/components/SectionEmpty";
import { Select } from "@/components/Select";

// ── Component ─────────────────────────────────────────────────────────────────

export default function Landing() {
  const { lang } = useLanguage();
  const t = (key: string) => tr(lang, key);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"amniotic" | "placental">(
    "amniotic",
  );

  const [isLoading, setIsLoading] = useState(true);
  const [amnioticProducts, setAmnioticProducts] = useState<LandingProduct[]>([]);
  const [placentalProducts, setPlacentalProducts] = useState<LandingProduct[]>([]);
  const [areas, setAreas] = useState<LandingArea[]>([]);
  const [caseStudies, setCaseStudies] = useState<LandingCaseStudy[]>([]);
  const [pipeline, setPipeline] = useState<LandingPipelineItem[]>([]);

  const push = usePageLoader((s) => s.push);
  const pop = usePageLoader((s) => s.pop);
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
  const [canCaseScrollLeft, setCanCaseScrollLeft] = useState(false);
  const [canCaseScrollRight, setCanCaseScrollRight] = useState(true);


  const formRef = useRef<HTMLElement>(null);
  const caseScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      push();
      const [prodRes, pipeRes, caseRes, areaRes] = await Promise.allSettled([
        fetch(API_URLS.public.products).then((r) => r.json()),
        fetch(API_URLS.public.pipeline).then((r) => r.json()),
        fetch(API_URLS.public.caseStudies).then((r) => r.json()),
        fetch(API_URLS.public.areas).then((r) => r.json()),
      ]);

      if (prodRes.status === "fulfilled" && prodRes.value.success) {
        const all: { series: string; name: string; nanoparticles: string; type: string; description: string }[] = prodRes.value.data;
        setAmnioticProducts(all.filter((p) => p.series === "amniotic").map(({ name, nanoparticles, type, description }) => ({ name, nanoparticles, type, description })));
        setPlacentalProducts(all.filter((p) => p.series === "placental").map(({ name, nanoparticles, type, description }) => ({ name, nanoparticles, type, description })));
      }

      if (pipeRes.status === "fulfilled" && pipeRes.value.success) {
        setPipeline(
          pipeRes.value.data.map((item: { product_name: string; platform: string; stage: string }) => ({
            product: item.product_name,
            platform: item.platform,
            stage: item.stage,
          }))
        );
      }

      if (caseRes.status === "fulfilled" && caseRes.value.success) {
        setCaseStudies(
          caseRes.value.data.map((cs: {
            specialty: string; title: string; patient_description: string
            images: { src: string }[]; metrics: { label: string; value: string }[]
          }) => ({
            specialty: cs.specialty,
            title: cs.title,
            description: cs.patient_description,
            coverImage: cs.images[0]?.src ?? "",
            metrics: cs.metrics,
          }))
        );
      }

      if (areaRes.status === "fulfilled" && areaRes.value.success) {
        setAreas(
          areaRes.value.data.map(({ name, specialty, description }: { name: string; specialty: string; description: string }) => ({
            name,
            specialty,
            description,
          }))
        );
      }
      pop();
      setIsLoading(false);
    };

    fetchHomepageData();
  }, [push, pop]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const el = caseScrollRef.current;
    if (!el) return;
    const check = () => {
      setCanCaseScrollLeft(el.scrollLeft > 0);
      setCanCaseScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    };
    check();
    el.addEventListener("scroll", check);
    return () => el.removeEventListener("scroll", check);
  }, []);

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

  const productGroups = [
    {
      label: 'Amniotic Series',
      options: [
        { value: 'ExoMed 1', label: 'ExoMed 1 — 200M Nanoparticles (with HA)' },
        { value: 'ExoMed 2', label: 'ExoMed 2 — 1B Nanoparticles (with HA)' },
        { value: 'ExoTher', label: 'ExoTher — 200M Nanoparticles' },
        { value: 'ExoTher 1', label: 'ExoTher 1 — 1B Nanoparticles' },
        { value: 'ExoTher 2', label: 'ExoTher 2 — 10B Nanoparticles' },
        { value: 'ExoTher 3', label: 'ExoTher 3 — 100B Nanoparticles' },
        { value: 'ExoPro', label: 'ExoPro — 300B Nanoparticles' },
        { value: 'ExoFit', label: 'ExoFit — 750B Nanoparticles' },
        { value: 'ExoMatrix', label: 'ExoMatrix — 1.5T Nanoparticles (Special Order)' },
      ],
    },
    {
      label: 'Placental Cord Series',
      options: [
        { value: 'ExoLite', label: 'ExoLite — 750B Nanoparticles' },
        { value: 'ExoGen', label: 'ExoGen — 1.5T Nanoparticles (Special Order)' },
      ],
    },
    {
      label: 'Lainnya',
      options: [
        { value: 'unknown', label: t('form.product.unknown') },
      ],
    },
  ];
  const flatProductOptions = productGroups.flatMap((g) => g.options);

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
      <nav className="fixed top-0 inset-x-0 z-50 bg-white dark:bg-[#050505] border-b border-black/[0.06] dark:border-white/[0.06] shadow-sm dark:shadow-none">
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
          <img
            src="https://picsum.photos/seed/exomed-hero/1920/1080"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
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
                className="px-3 py-1.5 text-xs font-bold bg-white text-gray-700 rounded-full tracking-wide"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-2 text-white"
          >
            {t("hero.headline")}
          </motion.h1>
          <div className="w-16 h-1 bg-gold-gradient rounded-full mb-4" />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/70 max-w-2xl mb-10 leading-relaxed"
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-colors text-base"
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
        className="scroll-mt-24 py-24 px-6 border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
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
              ].map((item, i) => (
                <motion.div
                  key={item.lk}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mengapa Exosome ─────────────────────────────────────────────────── */}
      <section
        id="riset"
        className="scroll-mt-24 py-24 px-6 bg-black/[0.015] dark:bg-white/[0.01] border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14"
          >
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("why.label")}
            </p>
            <h2 className="text-4xl font-black">{t("why.title")}</h2>
            <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-xl mx-auto text-base leading-relaxed">
              {t("why.subtitle")}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Dna, tk: "why.card1.title", bk: "why.card1.body" },
              { icon: Microscope, tk: "why.card2.title", bk: "why.card2.body" },
              { icon: Zap, tk: "why.card3.title", bk: "why.card3.body" },
            ].map((item, i) => (
              <motion.div
                key={item.tk}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.07] dark:border-white/[0.06] rounded-2xl hover:border-primary/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-black text-base mb-3">{t(item.tk)}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  {t(item.bk)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Area Aplikasi ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-5"
          >
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("areas.label")}
            </p>
            <h2 className="text-4xl font-black">{t("areas.title")}</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-sm text-gray-500 dark:text-slate-500 border border-black/[0.07] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02] rounded-xl px-4 py-2.5 max-w-xl mx-auto mb-10"
          >
            {t("areas.disclaimer")}
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!isLoading && areas.length === 0 ? (
              <div className="col-span-2 md:col-span-4">
                <SectionEmpty message="Area aplikasi klinis belum tersedia" />
              </div>
            ) : areas.map((area, i) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.07] dark:border-white/[0.06] rounded-2xl hover:border-black/[0.14] dark:hover:border-white/[0.12] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all cursor-default"
              >
                {i % 4 !== 3
                  ? <div className="w-2.5 h-2.5 bg-primary rotate-45 mb-4" />
                  : <div className="w-2.5 h-2.5 border-2 border-primary/50 rounded-full mb-4" />
                }
                <div className="font-black text-base mb-1">{area.name}</div>
                <div className="text-xs font-bold text-primary/70 uppercase tracking-wider mb-2">
                  {area.specialty}
                </div>
                <div className="text-sm text-gray-500 dark:text-slate-500 leading-snug">
                  {area.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produk ──────────────────────────────────────────────────────────── */}
      <section
        id="produk"
        className="scroll-mt-24 py-24 px-6 bg-black/[0.015] dark:bg-white/[0.01] border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("products.label")}
            </p>
            <h2 className="text-4xl font-black">{t("products.title")}</h2>
            <p className="text-base text-gray-500 dark:text-slate-400 mt-3 max-w-lg mx-auto">
              {t("products.subtitle")}
            </p>
          </motion.div>

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
            {!isLoading && (activeTab === "amniotic" ? amnioticProducts : placentalProducts).length === 0 ? (
              <div className="col-span-3">
                <SectionEmpty message="Produk belum tersedia" />
              </div>
            ) : (activeTab === "amniotic"
              ? amnioticProducts
              : placentalProducts
            ).map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Studi Kasus ─────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start justify-between px-6 mb-6 gap-4"
          >
            <div>
              <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">
                {t("cases.label")}
              </p>
              <h2 className="text-4xl font-black">{t("cases.title")}</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0 mt-2">
              <button
                onClick={() => caseScrollRef.current?.scrollBy({ left: -caseScrollRef.current.clientWidth * 0.8, behavior: "smooth" })}
                disabled={!canCaseScrollLeft}
                aria-label="Scroll left"
                className="p-2 rounded-full border border-black/[0.08] dark:border-white/[0.10] bg-white dark:bg-white/[0.04] text-gray-600 dark:text-slate-300 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => caseScrollRef.current?.scrollBy({ left: caseScrollRef.current.clientWidth * 0.8, behavior: "smooth" })}
                disabled={!canCaseScrollRight}
                aria-label="Scroll right"
                className="p-2 rounded-full border border-black/[0.08] dark:border-white/[0.10] bg-white dark:bg-white/[0.04] text-gray-600 dark:text-slate-300 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          <div className="flex items-start gap-3 p-4 mb-8 mx-6 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
            <Shield className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300/80 leading-relaxed">
              {t("cases.disclaimer")}
            </p>
          </div>

          {!isLoading && caseStudies.length === 0 ? (
            <div className="px-6">
              <SectionEmpty message="Studi kasus belum tersedia" />
            </div>
          ) : (
          <div
            ref={caseScrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-6 pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {caseStudies.map((cs) => (
              <div key={cs.title} className="flex-shrink-0 w-[260px] sm:w-[300px] snap-start">
                <div className="group cursor-default">
                  <div className="relative overflow-hidden rounded-2xl mb-3 transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1">
                    <img
                      src={cs.coverImage}
                      alt={cs.title}
                      className="w-full h-[340px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4 flex flex-col justify-between text-white">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                        {cs.specialty}
                      </span>
                      <div>
                        <h3 className="font-black text-sm leading-snug">{cs.title}</h3>
                        {cs.metrics[0] && (
                          <p className="text-[11px] text-white/60 mt-1">
                            {cs.metrics[0].label}:{" "}
                            <span className="font-bold text-white/90">{cs.metrics[0].value}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-500 leading-relaxed line-clamp-2">
                    {cs.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* ── Kepatuhan & Sertifikasi ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-black/[0.015] dark:bg-white/[0.01] border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("compliance.label")}
            </p>
            <h2 className="text-4xl font-black">{t("compliance.title")}</h2>
          </motion.div>
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
            ].map((item, i) => (
              <motion.div
                key={item.lk}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.07] dark:border-white/[0.06] rounded-2xl text-center"
              >
                <item.icon className="w-7 h-7 text-primary mx-auto mb-3" />
                <div className="font-black text-base mb-1">{t(item.lk)}</div>
                <div className="text-sm text-gray-500 dark:text-slate-500">
                  {t(item.sk)}
                </div>
              </motion.div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("pipeline.label")}
            </p>
            <h2 className="text-4xl font-black">{t("pipeline.title")}</h2>
          </motion.div>
          {!isLoading && pipeline.length === 0 ? (
            <SectionEmpty message="Data pipeline belum tersedia" />
          ) : (
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
                {pipeline.map((item, i) => (
                  <motion.tr
                    key={item.product}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </section>

      {/* ── Form Konsultasi ─────────────────────────────────────────────────── */}
      <section
        ref={formRef}
        id="konsultasi"
        className="py-24 px-6 bg-black/[0.015] dark:bg-white/[0.01] border-t border-black/[0.06] dark:border-white/[0.06]"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10"
          >
            <p className="text-xs font-black text-primary uppercase tracking-widest mb-3">
              {t("form.label")}
            </p>
            <h2 className="text-4xl font-black">{t("form.title")}</h2>
            <p className="text-base text-gray-500 dark:text-slate-400 mt-3">
              {t("form.subtitle")}
            </p>
          </motion.div>

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
                  <Select
                    variant="public"
                    label={t("form.product")}
                    options={productGroups}
                    value={form.product_interest ? (flatProductOptions.find((o) => o.value === form.product_interest) ?? null) : null}
                    onChange={(opt) => setForm((p) => ({ ...p, product_interest: opt?.value ?? '' }))}
                    placeholder={t("form.product.ph")}
                    isSearchable={false}
                  />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Logo className="h-14 w-auto mb-4" variant="horizontal" />
              <p className="text-xs text-gray-500 dark:text-slate-500 leading-relaxed">
                {t("footer.about")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
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
