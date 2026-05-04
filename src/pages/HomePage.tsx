import {
  Brain,
  Target,
  Timer,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Flame,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sun,
  Moon,
  Coffee,
  Zap,
} from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { BookDemoModal } from "@/components/BookDemoModal";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { useParallaxOffset } from "@/hooks/useParallaxOffset";

type Stat = { value: string; label: string };
type FlowBlockJson = { time: string; title: string; body: string };
type VoiceQuoteJson = { big: boolean; quote: string; name: string; role: string };
type PricingTierJson = {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  featured: boolean;
};

const FLOW_TONES = ["muted", "primary", "accent", "muted", "muted", "primary"] as const;
const FLOW_ICONS = [Sun, Timer, Zap, Coffee, Calendar, Moon];

type FlowBlockView = FlowBlockJson & {
  icon: (typeof FLOW_ICONS)[number];
  tone: (typeof FLOW_TONES)[number];
};

const FLOW_CAROUSEL_GAP_PX = 16;

function slidesVisibleForWidth(width: number): number {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

function FlowDayCarousel({ blocks }: { blocks: FlowBlockView[] }) {
  const { t } = useTranslation();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const count = blocks.length;

  const slidesVisible = useMemo(() => {
    const raw = viewportWidth > 0 ? slidesVisibleForWidth(viewportWidth) : 1;
    return Math.min(raw, Math.max(1, count));
  }, [viewportWidth, count]);

  const maxIndex = Math.max(0, count - slidesVisible);
  const slideWidth =
    viewportWidth > 0 && slidesVisible > 0
      ? (viewportWidth - FLOW_CAROUSEL_GAP_PX * (slidesVisible - 1)) / slidesVisible
      : 0;
  const stepPx = slideWidth > 0 ? slideWidth + FLOW_CAROUSEL_GAP_PX : 0;

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setViewportWidth(el.offsetWidth);
    });
    ro.observe(el);
    setViewportWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  const from = index + 1;
  const to = Math.min(index + slidesVisible, count);
  const atStart = index <= 0;
  const atEnd = index >= maxIndex;

  return (
    <div className="relative">
      <div ref={viewportRef} className="overflow-hidden pb-1">
        <div
          className="flex gap-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            transform: stepPx > 0 ? `translate3d(-${index * stepPx}px, 0, 0)` : undefined,
          }}
        >
          {blocks.map((b, i) => (
            <div
              key={b.time}
              className="shrink-0"
              style={slideWidth > 0 ? { width: slideWidth } : { minWidth: "100%" }}
            >
              <div
                className={`h-full rounded-2xl border p-5 transition-all hover:-translate-y-0.5 sm:p-6 ${
                  b.tone === "primary"
                    ? "border-primary/30 bg-card shadow-elevated"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {b.time}
                  </span>
                  <b.icon
                    className={`h-4 w-4 shrink-0 ${b.tone === "primary" ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <h3 className="mt-4 text-base font-semibold tracking-tight sm:mt-5 sm:text-lg">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                <div className="mt-5 h-px bg-border sm:mt-6" />
                <div className="mt-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground sm:mt-3">
                  {t("home.flow.blockLabel", { num: String(i + 1).padStart(2, "0") })}{" "}
                  <span className="min-w-0 flex-1 h-px bg-border" />{" "}
                  {i === blocks.length - 1 ? t("home.flow.eod") : t("home.flow.arrow")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={atStart}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition enabled:hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            aria-label={t("home.flow.prevSlide")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[5.5rem] text-center text-xs font-mono tabular-nums text-muted-foreground sm:min-w-[7rem]">
            {t("home.flow.slideWindow", { from, to, total: count })}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={atEnd}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition enabled:hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
            aria-label={t("home.flow.nextSlide")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <nav
          className="flex max-w-full flex-wrap justify-center gap-2"
          aria-label={t("home.flow.kicker")}
        >
          {Array.from({ length: maxIndex + 1 }, (_, j) => (
            <button
              key={j}
              type="button"
              aria-current={j === index ? "true" : undefined}
              aria-label={t("home.flow.goToSlide", { num: String(j + 1).padStart(2, "0") })}
              onClick={() => setIndex(j)}
              className={`h-2 rounded-full transition-all ${
                j === index
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/35 hover:bg-muted-foreground/55"
              }`}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ---------- Side rail ---------- */
function SideRail() {
  const { t } = useTranslation();
  const links = [
    { href: "#today", label: t("home.sideRail.today") },
    { href: "#features", label: t("home.sideRail.tools") },
    { href: "#flow", label: t("home.sideRail.flow") },
    { href: "#voices", label: t("home.sideRail.voices") },
    { href: "#pricing", label: t("home.sideRail.plans") },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 z-40 border-r border-border bg-background/80 backdrop-blur-xl flex-col items-center justify-between py-6">
      <a href="#top" className="flex flex-col items-center gap-2">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </span>
      </a>

      <nav className="flex flex-col items-center gap-1 text-[10px] font-medium tracking-wider uppercase text-muted-foreground">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="px-2 py-3 rounded-lg hover:text-foreground hover:bg-muted transition writing-vertical"
            style={{ writingMode: "vertical-rl" }}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground hover:text-foreground rotate-180"
        style={{ writingMode: "vertical-rl" }}
      >
        {t("home.sideRail.signIn")}
      </button>
    </aside>
  );
}

/* ---------- Top bar (mobile + meta) ---------- */
function TopBar() {
  const { t } = useTranslation();

  return (
    <div className="lg:pl-20">
      <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border gap-3">
        <div className="flex items-center gap-3 lg:hidden min-w-0">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-hero">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="font-semibold tracking-tight truncate">{t("home.brand")}</span>
        </div>
        <div className="hidden lg:flex items-center gap-6 text-xs text-muted-foreground font-mono uppercase tracking-widest min-w-0">
          <span>{t("home.topBar.version")}</span>
          <span className="hidden xl:inline truncate">{t("home.topBar.liveStat")}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition"
          >
            {t("home.topBar.getStarted")} <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- HERO: asymmetric split ---------- */
function Hero() {
  const { t } = useTranslation();
  const stats = t("home.hero.stats", { returnObjects: true }) as Stat[];
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxY = useParallaxOffset(sectionRef, 0.11);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="lg:pl-20 relative overflow-hidden border-b border-border"
    >
      <div
        className="absolute -top-24 -left-24 w-[26rem] h-[26rem] rounded-full bg-primary/10 blur-3xl pointer-events-none will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY * 0.42}px, 0)` }}
        aria-hidden
      />
      <div
        className="absolute top-1/3 -right-20 h-[22rem] w-[22rem] rounded-full bg-primary/10 blur-3xl pointer-events-none will-change-transform hidden lg:block"
        style={{ transform: `translate3d(0, ${-parallaxY * 0.28}px, 0)` }}
        aria-hidden
      />

      <div className="grid lg:grid-cols-12 relative">
        <div
          id="today"
          className="lg:col-span-7 px-6 sm:px-10 lg:px-16 py-16 lg:py-24 relative overflow-hidden"
        >
          <RevealOnScroll>
            <div className="relative">
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                {t("home.hero.badge")}
                <span>{t("home.hero.badgeIndex")}</span>
              </div>

              <h1 className="mt-8 text-[clamp(2.75rem,7vw,6.5rem)] font-semibold tracking-[-0.04em] leading-[0.95]">
                {t("home.hero.titleLine1")}
                <br />
                <span className="italic font-normal text-muted-foreground">
                  {t("home.hero.titleLine2")}
                </span>
                <br />
                <span className="text-gradient">{t("home.hero.titleLine3")}</span>
              </h1>

              <p className="mt-10 max-w-md text-lg text-muted-foreground leading-relaxed">
                {t("home.hero.subtitle")}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#pricing"
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition"
                >
                  {t("home.hero.ctaPrimary")}
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a
                  href="#flow"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium hover:bg-muted transition"
                >
                  {t("home.hero.ctaSecondary")}
                </a>
              </div>

              <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border bg-gradient-subtle relative">
          <RevealOnScroll className="h-full" delayMs={90}>
            <div className="sticky top-0 p-6 sm:p-10 space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                <span>{t("home.hero.panelTime")}</span>
                <span className="flex items-center gap-1.5">
                  <Sun className="h-3 w-3" /> {t("home.hero.panelMood")}
                </span>
              </div>

              <div className="rounded-2xl border border-primary/30 bg-card p-5 shadow-elevated">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {t("home.hero.aiLabel")}
                </div>
                <p className="mt-3 text-[15px] leading-snug">
                  {t("home.hero.aiCardBefore")}{" "}
                  <span className="font-semibold">{t("home.hero.aiCardHighlight")}</span>{" "}
                  {t("home.hero.aiCardAfter")}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 text-xs font-medium px-3 py-2.5 rounded-lg bg-foreground text-background hover:opacity-90 transition"
                  >
                    {t("home.hero.aiStartFocus")}
                  </button>
                  <button
                    type="button"
                    className="shrink-0 text-xs font-medium px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted transition"
                  >
                    {t("home.hero.aiLater")}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                    </span>
                    {t("home.hero.focusSession")}
                  </div>
                  <Timer className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <div className="text-sm font-medium">{t("home.hero.focusTaskTitle")}</div>
                  <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[26%] bg-gradient-hero rounded-full" />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    <span>{t("home.hero.focusMinStart")}</span>
                    <span>{t("home.hero.focusMinEnd")}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t("home.hero.streakTitle")}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("home.hero.streakSubtitle")}
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <span key={i} className="h-6 w-1.5 rounded-full bg-gradient-hero" />
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

/* ---------- Marquee ---------- */
function Marquee() {
  const { t } = useTranslation();
  const items = t("home.marquee.items", { returnObjects: true }) as string[];
  const row = [...items, ...items, ...items];

  return (
    <section className="lg:pl-20 border-b border-border overflow-hidden bg-background">
      <RevealOnScroll>
        <div className="flex items-center gap-12 py-7 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {row.map((b, i) => (
            <span
              key={i}
              className="text-2xl font-semibold tracking-tight text-muted-foreground/60 hover:text-foreground transition shrink-0"
            >
              {b}
            </span>
          ))}
        </div>
      </RevealOnScroll>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}

/* ---------- Bento Features ---------- */
function Bento() {
  const { t } = useTranslation();

  return (
    <section id="features" className="lg:pl-20 border-b border-border">
      <div className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
        <RevealOnScroll>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="text-xs font-mono uppercase tracking-widest text-primary">
                {t("home.bento.kicker")}
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05]">
                {t("home.bento.titleLine1")}
                <br />
                <span className="italic font-normal text-muted-foreground">
                  {t("home.bento.titleLine2")}
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">{t("home.bento.subtitle")}</p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={70}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(200px,auto)]">
            <BentoCard
              className="md:col-span-4 md:row-span-2 bg-gradient-hero text-primary-foreground border-transparent"
              big
            >
              <div>
                <Brain className="h-7 w-7" />
                <h3 className="mt-6 text-3xl font-semibold tracking-tight leading-tight">
                  {t("home.bento.bigTitleLine1")}
                  <br />
                  {t("home.bento.bigTitleLine2")}
                </h3>
                <p className="mt-4 text-primary-foreground/80 max-w-md">
                  {t("home.bento.bigDesc")}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-primary-foreground/70">
                <Sparkles className="h-4 w-4" /> {t("home.bento.bigFooter")}
              </div>
            </BentoCard>

            <BentoCard
              className="md:col-span-2"
              icon={Target}
              title={t("home.bento.cardPrioritizationTitle")}
              desc={t("home.bento.cardPrioritizationDesc")}
            />
            <BentoCard
              className="md:col-span-2"
              icon={Timer}
              title={t("home.bento.cardFocusTitle")}
              desc={t("home.bento.cardFocusDesc")}
            />

            <BentoCard
              className="md:col-span-2"
              icon={Calendar}
              title={t("home.bento.cardCalendarTitle")}
              desc={t("home.bento.cardCalendarDesc")}
            />
            <BentoCard
              className="md:col-span-2"
              icon={TrendingUp}
              title={t("home.bento.cardReviewsTitle")}
              desc={t("home.bento.cardReviewsDesc")}
            />
            <BentoCard
              className="md:col-span-2 bg-foreground text-background border-transparent"
              icon={Shield}
              title={t("home.bento.cardPrivateTitle")}
              desc={t("home.bento.cardPrivateDesc")}
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

function BentoCard({
  className = "",
  icon: Icon,
  title,
  desc,
  children,
  big = false,
}: {
  className?: string;
  icon?: React.ElementType;
  title?: string;
  desc?: string;
  children?: React.ReactNode;
  big?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-3xl border border-border bg-card p-7 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated ${className}`}
    >
      {children ?? (
        <>
          <div>
            {Icon && (
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${big ? "" : "bg-primary/10 text-primary group-hover:bg-gradient-hero group-hover:text-primary-foreground transition-colors"}`}
              >
                <Icon className="h-5 w-5" />
              </div>
            )}
            <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
            <p className="mt-2 text-sm opacity-70 leading-relaxed">{desc}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 opacity-30 group-hover:opacity-100 self-end transition-opacity" />
        </>
      )}
    </div>
  );
}

/* ---------- A day in flow (timeline) ---------- */
function FlowTimeline() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const flowParallax = useParallaxOffset(sectionRef, 0.08);
  const blocksData = t("home.flow.blocks", { returnObjects: true }) as FlowBlockJson[];
  const blocks: FlowBlockView[] = blocksData.map((b, i) => ({
    ...b,
    icon: FLOW_ICONS[i]!,
    tone: FLOW_TONES[i]!,
  }));

  return (
    <section
      ref={sectionRef}
      id="flow"
      className="lg:pl-20 border-b border-border bg-gradient-subtle relative overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-primary/8 blur-3xl will-change-transform lg:h-96 lg:w-96"
        style={{ transform: `translate3d(${flowParallax * 0.18}px, ${flowParallax * 0.25}px, 0)` }}
        aria-hidden
      />

      <div className="relative px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
        <RevealOnScroll>
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-mono uppercase tracking-widest text-primary">
              {t("home.flow.kicker")}
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05]">
              {t("home.flow.titleLine1")}
              <br />
              <span className="italic font-normal text-muted-foreground">
                {t("home.flow.titleLine2")}
              </span>
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="block" delayMs={80}>
          <FlowDayCarousel blocks={blocks} />
        </RevealOnScroll>
      </div>
    </section>
  );
}

/* ---------- Voices ---------- */
function Voices() {
  const { t } = useTranslation();
  const quotes = t("home.voices.quotes", { returnObjects: true }) as VoiceQuoteJson[];
  const [q0, q1, q2] = quotes;

  return (
    <section id="voices" className="lg:pl-20 border-b border-border">
      <div className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-10">
          <RevealOnScroll className="lg:col-span-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-primary">
                {t("home.voices.kicker")}
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05]">
                {t("home.voices.titleLine1")}
                <br />
                <span className="italic font-normal text-muted-foreground">
                  {t("home.voices.titleLine2")}
                </span>
              </h2>
              <div className="mt-8 flex items-baseline gap-3">
                <span className="text-5xl font-semibold tracking-tight">4.9</span>
                <span className="text-sm text-muted-foreground">{t("home.voices.ratingLine")}</span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-8 grid sm:grid-cols-2 gap-4" delayMs={70}>
            {q0 && <Quote big={q0.big} quote={q0.quote} name={q0.name} role={q0.role} />}
            <div className="grid gap-4">
              {q1 && <Quote big={q1.big} quote={q1.quote} name={q1.name} role={q1.role} />}
              {q2 && <Quote big={q2.big} quote={q2.quote} name={q2.name} role={q2.role} />}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

function Quote({
  quote,
  name,
  role,
  big = false,
}: {
  quote: string;
  name: string;
  role: string;
  big?: boolean;
}) {
  return (
    <figure
      className={`rounded-3xl border border-border bg-card p-7 flex flex-col ${big ? "sm:row-span-2 bg-gradient-card" : ""}`}
    >
      <div className="text-primary text-3xl font-serif leading-none">"</div>
      <blockquote className={`mt-3 ${big ? "text-xl" : "text-[15px]"} leading-relaxed flex-1`}>
        {quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-gradient-hero shadow-soft" />
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </figcaption>
    </figure>
  );
}

/* ---------- Pricing ---------- */
function Pricing() {
  const { t } = useTranslation();
  const tiers = t("home.pricing.tiers", { returnObjects: true }) as PricingTierJson[];

  return (
    <section id="pricing" className="lg:pl-20 border-b border-border">
      <div className="px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
        <RevealOnScroll>
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono uppercase tracking-widest text-primary">
              {t("home.pricing.kicker")}
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05]">
              {t("home.pricing.titleLine1")}
              <br />
              <span className="italic font-normal text-muted-foreground">
                {t("home.pricing.titleLine2")}
              </span>
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={60}>
          <div className="rounded-3xl border border-border overflow-hidden divide-y lg:divide-y-0 lg:grid lg:grid-cols-3 lg:divide-x divide-border bg-card">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative p-8 lg:p-10 flex flex-col ${tier.featured ? "bg-gradient-subtle" : ""}`}
              >
                {tier.featured && (
                  <span className="absolute top-6 right-6 text-[10px] font-mono uppercase tracking-widest text-primary">
                    {t("home.pricing.mostLoved")}
                  </span>
                )}
                <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-semibold tracking-tight">${tier.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.desc}</p>

                <ul className="mt-8 space-y-3 text-sm flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 shrink-0 ${tier.featured ? "text-primary" : "text-success"}`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`mt-10 inline-flex items-center justify-center gap-2 h-12 rounded-full text-sm font-medium transition ${
                    tier.featured
                      ? "bg-foreground text-background hover:opacity-90"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {tier.cta} <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

/* ---------- Big CTA + Footer ---------- */
function CTAFooter({ onBookDemo }: { onBookDemo: () => void }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaParallax = useParallaxOffset(ctaRef, 0.06);

  return (
    <section className="lg:pl-20">
      <div ref={ctaRef} className="px-6 sm:px-10 lg:px-16 py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-50">
          <div
            className="absolute left-1/2 top-1/2 h-[140%] w-[140%] bg-gradient-hero blur-3xl opacity-20 will-change-transform"
            style={{
              transform: `translate3d(calc(-50% + ${ctaParallax * 0.12}px), calc(-50% + ${ctaParallax * 0.2}px), 0)`,
            }}
            aria-hidden
          />
        </div>

        <RevealOnScroll>
          <div className="max-w-4xl">
            <h2 className="text-[clamp(3rem,9vw,8rem)] font-semibold tracking-[-0.04em] leading-[0.9]">
              {t("home.cta.titleLine1")}
              <br />
              {t("home.cta.titleLine2")}
              <span className="text-gradient">{t("home.cta.titleHighlight")}</span>
            </h2>
            <p className="mt-8 max-w-md text-lg text-muted-foreground">{t("home.cta.subtitle")}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-medium hover:opacity-90 transition"
              >
                {t("home.cta.primary")}
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <button
                type="button"
                onClick={onBookDemo}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium hover:bg-muted transition"
              >
                {t("home.cta.secondary")}
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      <footer className="border-t border-border px-6 sm:px-10 lg:px-16 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-hero">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </span>
          <span className="font-medium text-foreground">{t("home.brand")}</span>
          <span className="font-mono text-xs">{t("home.cta.footerCopyright", { year })}</span>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest flex-wrap">
          <a href="#" className="hover:text-foreground transition">
            {t("home.cta.privacy")}
          </a>
          <a href="#" className="hover:text-foreground transition">
            {t("home.cta.terms")}
          </a>
          <a href="#" className="hover:text-foreground transition">
            {t("home.cta.changelog")}
          </a>
          <a href="#" className="hover:text-foreground transition">
            {t("home.cta.contact")}
          </a>
        </div>
      </footer>
    </section>
  );
}

export default function HomePage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <SideRail />
      <TopBar />
      <main>
        <Hero />
        <Marquee />
        <Bento />
        <FlowTimeline />
        <Voices />
        <Pricing />
        <CTAFooter onBookDemo={() => setDemoOpen(true)} />
      </main>
      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
