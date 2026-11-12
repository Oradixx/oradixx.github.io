import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Briefcase, FolderKanban, House, Mail, Search, Wrench, X } from "lucide-react";
import ScrambleText from "@/components/ruixen/scramble-text";
import { MagneticTabs } from "@/components/ruixen/magnetic-tabs";
import { AnimatedThemeToggler } from "@/components/ruixen/animated-theme-toggler";
import ConfettiButton from "@/components/ruixen/confetti-button";
import { cn } from "@/lib/utils";
import { education, ideas, links, pipeline, projects, proofs, skills, type Kind, type Project } from "./data";
import { Figure } from "./Figures";
import { hourLabel, Trace, useFgf, type Fgf } from "./Trace";

const ease = [0.2, 0.7, 0.2, 1] as const;
const wrap = "mx-auto w-full max-w-[1180px] px-5 sm:px-8";
const h2 = "font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.01em]";
const spot = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};
const downloadCv = () => { const a = document.createElement("a"); a.href = links.cv; a.download = ""; a.click(); };

/* ---------- hero: the name over a replay of the grid ---------- */
function Hero({ fgf }: { fgf: Fgf | null }) {
  const [hour, setHour] = useState<number | null>(null);
  const a = fgf && hour != null ? fgf.a[hour] : null, m = fgf && hour != null ? fgf.m[hour] : null;
  return (
    <header id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {fgf && <Trace data={fgf} onRead={setHour} />}
      <div className={cn(wrap, "relative flex items-center justify-between gap-4 pt-6 text-sm")}>
        <p className="m-0 text-dim">Open to a 6-month internship or VIE from <strong className="font-medium text-ink">February 2027</strong></p>
        <p className="m-0 hidden gap-5 sm:flex"><a className="underline decoration-line underline-offset-4 hover:decoration-amber" href={links.simple}>Simple version</a><a className="underline decoration-line underline-offset-4 hover:decoration-amber" href={links.interactive}>Interactive version</a></p>
      </div>

      {fgf && hour != null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className={cn(wrap, "relative mt-8 sm:mt-12")} aria-hidden="true">
          <div className="num ml-auto w-fit rounded-xl border border-line bg-surface/80 px-4 py-3 text-sm backdrop-blur">
            <p className="m-0 text-dim">France, {hourLabel(fgf, hour)}</p>
            <p className="m-0"><i className="mr-2 inline-block size-2 rounded-full bg-teal" />{a != null ? `${(a / 10).toFixed(1)} GW consumed` : "no reading"}</p>
            <p className="m-0"><i className="mr-2 inline-block size-2 rounded-full bg-amber" />{m != null ? `${(m / 10).toFixed(1)} GW forecast the day before` : "run missed that day"}</p>
          </div>
        </motion.div>
      )}

      <div className={cn(wrap, "relative mt-auto pb-28 pt-16")}>
        <h1 aria-label="Clément Vurpillot" className="m-0 font-display text-[clamp(3.75rem,13vw,12rem)] leading-[0.86] tracking-[-0.02em]">
          {["Clément", "Vurpillot"].map((word, w) => (
            <span key={word} aria-hidden="true" className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              {word.split("").map((c, i) => (
                <motion.span key={i} className="inline-block" initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ delay: 0.15 + w * 0.25 + i * 0.035, duration: 0.9, ease }}>{c}</motion.span>
              ))}
            </span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7, ease }}
          className="mt-7 grid items-end gap-6 md:grid-cols-[minmax(0,34rem)_1fr]">
          <p className="m-0 text-xl leading-snug sm:text-2xl">Final-year data and AI engineering student at ESILV, Paris. I build data pipelines and models, and I measure what they do.</p>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <ConfettiButton label="Download my CV" sound={false} onClick={downloadCv}
              style={{ background: "var(--amber)", color: "var(--bg)", border: "0", fontSize: 16, fontWeight: 600, padding: "13px 22px", borderRadius: 12 }} />
            <a href={links.linkedin} className="rounded-xl border border-line bg-surface/70 px-5 py-3 font-medium backdrop-blur transition-colors hover:border-amber">LinkedIn</a>
            <a href={links.github} className="rounded-xl border border-line bg-surface/70 px-5 py-3 font-medium backdrop-blur transition-colors hover:border-amber">GitHub</a>
          </div>
        </motion.div>
        {fgf && <p className="mt-8 max-w-xl text-sm text-dim">Behind the name: a replay of my <a className="underline decoration-line underline-offset-4" href="#projects">France Grid Forecast</a>. The solid line is what France consumed; the dotted line is what I had forecast a day earlier, so it always runs 24 hours ahead.</p>}
      </div>
    </header>
  );
}

/* ---------- four results, one per screen of scrolling ---------- */
function Proof() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [i, setI] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setI(Math.max(0, Math.min(proofs.length - 1, Math.floor(v * proofs.length)))));
  const p = proofs[i];
  return (
    <section ref={ref} aria-label="Key results" style={{ height: `${proofs.length * 85}vh` }} className="relative border-y border-line bg-surface">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className={cn(wrap, "grid items-center gap-8 md:grid-cols-[1fr_minmax(0,24rem)]")}>
          <AnimatePresence mode="wait">
            <motion.p key={p.value} className="num m-0 font-display text-[clamp(6rem,24vw,21rem)] leading-[0.8] text-amber"
              initial={{ opacity: 0, y: 60, filter: "blur(14px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -60, filter: "blur(14px)" }} transition={{ duration: 0.45, ease }}>
              {p.value}
            </motion.p>
          </AnimatePresence>
          <div>
            <AnimatePresence mode="wait">
              <motion.div key={p.value} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }}>
                <p className="m-0 text-2xl leading-snug">{p.text}</p>
                <p className="mt-3 text-dim"><a className="underline decoration-line underline-offset-4 hover:decoration-amber" href={p.href}>{p.source}</a></p>
              </motion.div>
            </AnimatePresence>
            <ol className="mt-8 flex list-none gap-2 p-0" aria-hidden="true">
              {proofs.map((q, k) => <li key={q.value} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", k <= i ? "bg-amber" : "bg-line")} />)}
            </ol>
          </div>
        </div>
      </div>
      {/* the same facts for readers who don't get the animation */}
      <ul className="sr-only">{proofs.map((q) => <li key={q.value}>{q.value}: {q.text} ({q.source})</li>)}</ul>
    </section>
  );
}

/* ---------- experience: pick a stage of the pipeline ---------- */
function Experience() {
  const [stage, setStage] = useState(3);
  return (
    <section id="experience" className={cn(wrap, "pt-28")}>
      <h2 className={h2}>Experience</h2>
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div>
          <h3 className="m-0 font-display text-4xl leading-none">Data and AI engineering intern, CERTAM</h3>
          <p className="mt-3 text-dim">Rouen, April–August 2026. CERTAM is an applied research centre that tests engines and their emissions.</p>
          <ul className="mt-5 list-disc space-y-3 pl-5">
            <li>Built the ingestion pipeline for vessel telemetry sampled at 1 Hz, from the J1939 CAN bus to PostgreSQL with TimescaleDB.</li>
            <li>Trained a Random Forest that rebuilds particulate readings when the sensor fails (R² up to 0.96), explained it with SHAP and presented it to the test engineers.</li>
            <li>Moved slow dashboard queries into SQL materialised views. The dashboard now loads in <span className="text-amber">30 seconds</span>; it used to take 3 hours.</li>
            <li>Deployed a Streamlit app and real-time Grafana alerting on a hardened Linux VPS.</li>
          </ul>
        </div>
        <div className="spot rounded-3xl border border-line bg-surface p-6 sm:p-8" onPointerMove={spot}>
          <p className="m-0 font-medium">The telemetry pipeline I built</p>
          <p className="m-0 text-sm text-dim">Five stages, in order. Select one to see what happens there.</p>
          <ol className="mt-6 list-none p-0">
            {pipeline.map((s, i) => (
              <li key={s.name} className="relative pb-3 pl-9 last:pb-0">
                {i < pipeline.length - 1 && <span className="absolute bottom-0 left-[9px] top-5 w-px bg-line" aria-hidden="true"><motion.i className="absolute -left-[3px] block size-[7px] rounded-full bg-teal" animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.1, delay: i * 0.28, repeat: Infinity, ease: "linear" }} /></span>}
                <span className={cn("absolute left-0 top-1.5 size-[19px] rounded-full border-2 transition-colors", stage === i ? "border-amber bg-amber" : "border-line bg-bg")} aria-hidden="true" />
                <button type="button" aria-expanded={stage === i} onClick={() => setStage(i)} className="flex w-full cursor-pointer flex-wrap items-baseline justify-between gap-x-4 text-left">
                  <span className={cn("font-medium transition-colors", stage === i && "text-amber")}>{s.name}</span>
                  <span className="text-sm text-dim">{s.tech}</span>
                </button>
                <AnimatePresence initial={false}>
                  {stage === i && (
                    <motion.p className="m-0 overflow-hidden text-[0.9375rem] text-dim" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }}>
                      <span className="block pb-2 pt-1 text-ink">{s.detail}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-14 border-t border-line pt-10 lg:max-w-3xl">
        <h3 className="m-0 font-display text-4xl leading-none">Data labelling and quality supervisor, Diduenjoy</h3>
        <p className="mt-3 text-dim">Paris. Internship in July–October 2024, freelance again in August 2025.</p>
        <ul className="mt-5 list-disc space-y-3 pl-5">
          <li>Supervised a team of 5 interns working under a 72-hour SLA, and ran weekly data quality audits.</li>
          <li>Labelled customer verbatims against business taxonomies and measured the precision and recall of the NLP models in production.</li>
        </ul>
      </div>
    </section>
  );
}

/* ---------- projects: filter, then open one ---------- */
const filters: { value: "all" | Kind; label: string }[] = [
  { value: "all", label: "Main projects" }, { value: "data", label: "Data engineering" }, { value: "ml", label: "Machine learning" }, { value: "small", label: "Smaller ones" },
];

function Projects({ onOpen }: { onOpen: (id: string) => void }) {
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const shown = projects.filter((p) => (filter === "all" ? !p.kinds.includes("small") : filter === "small" ? p.kinds.includes("small") : p.kinds.includes(filter)));
  return (
    <section id="projects" className={cn(wrap, "pt-28")}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className={h2}>Projects</h2>
        <div className="max-w-full overflow-x-auto"><MagneticTabs items={filters} defaultValue="all" sound={false} onChange={(v) => setFilter(v as "all" | Kind)} /></div>
      </div>
      <motion.ul layout className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.3, ease }}>
              <motion.button type="button" layoutId={`card-${p.id}`} onClick={() => onOpen(p.id)} onPointerMove={spot} whileHover={{ y: -4 }}
                className="spot group flex h-full w-full cursor-pointer flex-col rounded-3xl border border-line bg-surface p-6 text-left transition-colors hover:border-amber">
                {p.stat && <span className="num font-display text-6xl leading-none text-amber">{p.stat.value}</span>}
                {p.stat && <span className="mt-2 text-sm text-dim">{p.stat.label}</span>}
                <ScrambleText as="h3" className={cn("m-0 font-medium", p.stat ? "mt-8 text-xl" : "text-xl")}>{p.name}</ScrambleText>
                <span className="mt-2 text-[0.9375rem] text-dim">{p.summary}</span>
                <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-medium">Open the details <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span>
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}

function ProjectSheet({ project, fgf, onClose }: { project: Project; fgf: Fgf | null; onClose: () => void }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    close.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-6">
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.article layoutId={`card-${project.id}`} role="dialog" aria-modal="true" aria-label={project.name}
        className="relative max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl border border-line bg-surface p-6 sm:p-10">
        <button ref={close} type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 cursor-pointer rounded-full border border-line p-2 hover:border-amber"><X size={18} /></button>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          {project.stat && <p className="num m-0 font-display text-7xl leading-none text-amber">{project.stat.value}<span className="ml-3 font-sans text-base text-dim">{project.stat.label}</span></p>}
          <h3 className="mb-0 mt-5 pr-10 font-display text-5xl leading-none">{project.name}</h3>
          <p className="mt-3 text-sm text-dim">{project.meta}</p>
          <div className={cn("mt-6 grid gap-8", project.fig && "lg:grid-cols-2")}>
            <div>
              {project.body.map((t) => <p key={t.slice(0, 24)} className="mb-4 mt-0">{t}</p>)}
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">{project.stack.map((s) => <li key={s} className="rounded-full border border-line px-3 py-0.5 text-sm">{s}</li>)}</ul>
              <p className="mb-0 mt-6 flex flex-wrap gap-3">
                {project.href && <a href={project.href} className="inline-flex items-center gap-1 rounded-xl bg-amber px-4 py-2 font-medium text-bg">Open the project <ArrowUpRight size={16} aria-hidden="true" /></a>}
                {project.code && <a href={project.code} className="inline-flex items-center gap-1 rounded-xl border border-line px-4 py-2 font-medium hover:border-amber">{project.id === "templates" ? "Coursework template" : "Code"} <ArrowUpRight size={16} aria-hidden="true" /></a>}
              </p>
            </div>
            {project.fig && <div><Figure kind={project.fig} fgf={fgf} /></div>}
          </div>
        </motion.div>
      </motion.article>
    </div>
  );
}

/* ---------- skills: pick one, see where it was used ---------- */
function Skills({ onOpen }: { onOpen: (id: string) => void }) {
  const [sel, setSel] = useState<[string, string] | null>(null);
  const used = sel ? sel[1].split(" ") : [];
  return (
    <section id="skills" className={cn(wrap, "pt-28")}>
      <h2 className={h2}>Skills</h2>
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <dl className="m-0 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {skills.map((g) => (
            <div key={g.group}>
              <dt className="font-display text-2xl">{g.group}</dt>
              <dd className="m-0 mt-3 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <motion.button key={it[0]} type="button" aria-pressed={sel?.[0] === it[0]} onClick={() => setSel(sel?.[0] === it[0] ? null : it)} whileTap={{ scale: 0.92 }}
                    className={cn("cursor-pointer rounded-full border px-3.5 py-1 text-[0.9375rem] transition-colors", sel?.[0] === it[0] ? "border-amber bg-amber text-bg" : "border-line bg-surface hover:border-amber")}>{it[0]}</motion.button>
                ))}
                {g.plain && <span className="w-full text-[0.9375rem] text-dim">Also: {g.plain}</span>}
              </dd>
            </div>
          ))}
        </dl>
        <div className="min-h-56 rounded-3xl border border-line bg-surface p-6" aria-live="polite">
          {!sel ? <p className="m-0 text-dim">Select a skill to see which projects use it.</p> : (
            <>
              <p className="m-0 font-medium">{sel[0]} is used in</p>
              <ul className="m-0 mt-3 list-none p-0">
                <AnimatePresence mode="popLayout">
                  {used.map((id, k) => {
                    const p = projects.find((x) => x.id === id);
                    return (
                      <motion.li key={`${sel[0]}-${id}`} layout initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: k * 0.04, duration: 0.3, ease }} className="border-t border-line first:border-t-0">
                        {p ? <button type="button" onClick={() => onOpen(p.id)} className="flex w-full cursor-pointer items-center justify-between gap-3 py-2.5 text-left hover:text-amber">{p.name}<ArrowUpRight size={15} aria-hidden="true" /></button>
                          : <a href="#experience" className="flex items-center justify-between gap-3 py-2.5 hover:text-amber">CERTAM internship<ArrowUpRight size={15} aria-hidden="true" /></a>}
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Ideas() {
  const [more, setMore] = useState(false);
  const groups = more ? ideas : ideas.slice(0, 1);
  return (
    <section id="ideas" className={cn(wrap, "pt-28")}>
      <h2 className={h2}>Ideas I want to build</h2>
      <p className="mt-4 text-dim">Projects I have scoped but not built yet, grouped by when I expect to start them.</p>
      {groups.map((g) => (
        <motion.div key={g.when} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
          <h3 className="mb-4 mt-10 font-display text-3xl">{g.when}</h3>
          <ul className="m-0 grid list-none gap-x-10 p-0 md:grid-cols-2">
            {g.items.map(([name, text]) => <li key={name} className="border-t border-line py-4 text-[0.9375rem] text-dim"><strong className="mb-1 block text-base font-medium text-ink">{name}</strong>{text}</li>)}
          </ul>
        </motion.div>
      ))}
      <button type="button" aria-expanded={more} onClick={() => setMore(!more)} className="mt-8 cursor-pointer rounded-xl border border-line px-4 py-2 font-medium hover:border-amber">{more ? "Show only the next ones" : "Show eight more ideas"}</button>
    </section>
  );
}

function Education() {
  return (
    <section id="education" className={cn(wrap, "pt-28")}>
      <h2 className={h2}>Education</h2>
      <div className="mt-10 border-b border-line">
        {education.map((e) => (
          <div key={e.name} className="grid gap-x-10 gap-y-1 border-t border-line py-6 md:grid-cols-[minmax(0,20rem)_1fr]">
            <h3 className="m-0 font-display text-3xl leading-tight">{e.name}</h3>
            <div><p className="m-0 text-dim">{e.meta}</p><p className="m-0 mt-1">{e.text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="mt-32 border-t border-line bg-surface pb-36 pt-20">
      <div className={wrap}>
        <h2 className="m-0 font-display text-[clamp(3.5rem,12vw,10rem)] leading-[0.9]">Contact</h2>
        <p className="mt-6 max-w-2xl text-xl">I'm looking for a 6-month internship or a VIE from February 2027, in data engineering, MLOps, machine learning, AI engineering or data science. LinkedIn is the quickest way to reach me.</p>
        <p className="mt-8 flex flex-wrap gap-3">
          <a href={links.linkedin} className="inline-flex items-center gap-1 rounded-xl bg-amber px-5 py-3 font-semibold text-bg">Message me on LinkedIn <ArrowUpRight size={17} aria-hidden="true" /></a>
          <a href={links.cv} download className="rounded-xl border border-line px-5 py-3 font-medium hover:border-amber">CV (PDF, one page)</a>
          <a href={links.github} className="rounded-xl border border-line px-5 py-3 font-medium hover:border-amber">GitHub</a>
        </p>
        <p className="mt-14 text-sm text-dim">Last updated on 12 November 2026. Hosted on GitHub Pages. Other versions of this portfolio: <a className="underline underline-offset-4" href={links.simple}>simple</a>, <a className="underline underline-offset-4" href={links.interactive}>interactive</a>. Some interface pieces are adapted from the open-source Ruixen UI and Watermelon UI.</p>
      </div>
    </footer>
  );
}

/* ---------- dock (after Watermelon UI's dock) and command palette ---------- */
const sections = [
  { id: "top", label: "Top", Icon: House }, { id: "experience", label: "Experience", Icon: Briefcase }, { id: "projects", label: "Projects", Icon: FolderKanban },
  { id: "skills", label: "Skills", Icon: Wrench }, { id: "contact", label: "Contact", Icon: Mail },
];

function Dock({ onSearch }: { onSearch: () => void }) {
  const [current, setCurrent] = useState("top");
  const [bump, setBump] = useState<string | null>(null);
  useEffect(() => {
    const spy = () => {
      let cur = "top";
      for (const s of sections) { const el = document.getElementById(s.id); if (el && el.getBoundingClientRect().top <= innerHeight * 0.45) cur = s.id; }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = "contact";
      setCurrent(cur);
    };
    spy();
    addEventListener("scroll", spy, { passive: true });
    return () => removeEventListener("scroll", spy);
  }, []);
  const item = "relative grid size-11 cursor-pointer place-items-center rounded-xl bg-bg text-dim transition-colors hover:text-ink";
  const pop = { type: "spring" as const, stiffness: 550, damping: 15, mass: 1.1 };
  return (
    <motion.nav aria-label="Main" initial={{ y: 90, x: "-50%" }} animate={{ y: 0, x: "-50%" }} transition={{ delay: 1.3, type: "spring", stiffness: 300, damping: 24 }}
      className="fixed bottom-4 left-1/2 z-40 flex items-end gap-1.5 rounded-3xl border border-line bg-surface/90 p-2 shadow-2xl shadow-black/30 backdrop-blur sm:gap-2.5">
      {sections.map(({ id, label, Icon }) => (
        <motion.a key={id} href={`#${id}`} aria-label={label} aria-current={current === id ? "true" : undefined} title={label} onClick={() => { setBump(id); setTimeout(() => setBump(null), 200); }}
          style={{ transformOrigin: "bottom" }} whileHover={{ y: -5 }} animate={{ scale: bump === id ? 1.3 : 1 }} transition={pop} className={cn(item, current === id && "text-amber hover:text-amber")}>
          <Icon size={20} aria-hidden="true" />
          {current === id && <motion.i layoutId="dock-dot" className="absolute -bottom-1 block size-1 rounded-full bg-amber" />}
        </motion.a>
      ))}
      <span className="mx-0.5 h-8 w-px self-center bg-line" aria-hidden="true" />
      <motion.button type="button" onClick={onSearch} aria-label="Search this page (Ctrl K)" title="Search (Ctrl K)" whileHover={{ y: -5 }} transition={pop} className={item}><Search size={20} aria-hidden="true" /></motion.button>
      <span className="grid size-11 place-items-center rounded-xl bg-bg"><AnimatedThemeToggler sound={false} /></span>
    </motion.nav>
  );
}

interface Cmd { label: string; hint: string; run: () => void }

function Palette({ onClose, onOpen }: { onClose: () => void; onOpen: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [at, setAt] = useState(0);
  const go = (href: string) => () => { location.href = href; };
  const all = useMemo<Cmd[]>(() => [
    ...sections.map((s) => ({ label: s.label, hint: "Section", run: go(`#${s.id}`) })),
    ...projects.map((p) => ({ label: p.name, hint: "Project", run: () => onOpen(p.id) })),
    { label: "Download my CV", hint: "Action", run: downloadCv },
    { label: "Message me on LinkedIn", hint: "Action", run: go(links.linkedin) },
    { label: "Open my GitHub", hint: "Action", run: go(links.github) },
    { label: "Switch between night and day", hint: "Action", run: () => document.documentElement.classList.toggle("dark") },
    { label: "Read the simple version", hint: "Version", run: go(links.simple) },
    { label: "Open the interactive version", hint: "Version", run: go(links.interactive) },
  ], [onOpen]);
  const found = all.filter((c) => (c.label + " " + c.hint).toLowerCase().includes(q.trim().toLowerCase()));
  const pick = (c?: Cmd) => { if (!c) return; onClose(); c.run(); };
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[14vh]">
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div role="dialog" aria-modal="true" aria-label="Search this page" initial={{ opacity: 0, y: -16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.97 }} transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/40">
        <label className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="text-dim" aria-hidden="true" />
          <input autoFocus value={q} placeholder="Search projects, sections and actions" aria-label="Search projects, sections and actions"
            onChange={(e) => { setQ(e.target.value); setAt(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setAt((a) => Math.min(found.length - 1, a + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setAt((a) => Math.max(0, a - 1)); }
              if (e.key === "Enter") pick(found[at]);
            }}
            className="w-full bg-transparent py-4 text-base outline-none placeholder:text-dim focus-visible:outline-none" />
          <kbd className="rounded border border-line px-1.5 text-xs text-dim">Esc</kbd>
        </label>
        <ul className="m-0 max-h-[46vh] list-none overflow-y-auto p-2">
          {found.length === 0 && <li className="px-3 py-6 text-center text-dim">Nothing matches "{q}". Try a project name or "CV".</li>}
          {found.map((c, i) => (
            <li key={c.hint + c.label} ref={(el) => { if (i === at) el?.scrollIntoView({ block: "nearest" }); }}>
              <button type="button" onClick={() => pick(c)} onPointerMove={() => setAt(i)} className={cn("flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left", i === at && "bg-bg text-amber")}>
                {c.label}<span className="text-sm text-dim">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function App() {
  const fgf = useFgf();
  const [openId, setOpenId] = useState<string | null>(null);
  const [palette, setPalette] = useState(false);
  const open = projects.find((p) => p.id === openId) ?? null;
  const onOpen = useCallback((id: string) => setOpenId(id), []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); }
      if (e.key === "Escape") { setPalette(false); setOpenId(null); }
    };
    addEventListener("keydown", key);
    // remember the theme for the three versions
    const mo = new MutationObserver(() => { try { localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light"); } catch { /* private mode */ } });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => { removeEventListener("keydown", key); mo.disconnect(); };
  }, []);

  return (
    <LayoutGroup>
      <a href="#experience" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[70] focus:rounded focus:bg-surface focus:px-3 focus:py-1">Skip to content</a>
      <motion.div className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-amber" style={{ scaleX: progress }} aria-hidden="true" />
      <Hero fgf={fgf} />
      <main>
        <Proof />
        <Experience />
        <Projects onOpen={onOpen} />
        <Skills onOpen={onOpen} />
        <Ideas />
        <Education />
      </main>
      <Contact />
      <Dock onSearch={() => setPalette(true)} />
      <AnimatePresence>{open && <ProjectSheet key={open.id} project={open} fgf={fgf} onClose={() => setOpenId(null)} />}</AnimatePresence>
      <AnimatePresence>{palette && <Palette onClose={() => setPalette(false)} onOpen={onOpen} />}</AnimatePresence>
    </LayoutGroup>
  );
}
