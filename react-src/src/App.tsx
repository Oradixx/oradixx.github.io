import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Accordion, AccordionItem, Badge, Button, Card, CommandGroup, CommandItem, CommandPalette, CommandPaletteTrigger, DataTable, Dialog, Drawer,
  PERSONALITY_NAMES, PlonkProvider, Progress, Slider, Tab, TabList, TabPanel, Tabs, createDataTableColumns, personalities, toast, type DataTableColumn,
} from "plonk-ui";
import { BlobBurstSticker, CosmicEyeSticker, CuriousGlobeSticker, EyeSplatSticker, FlameSticker, FoldedPaperSticker, MetalSticker, NoriLaptopSticker, PipDetectiveSticker, SpiralSticker, StarBurstSticker } from "stick-it-up";
import ScrambleText from "@/components/ruixen/scramble-text";
import ConfettiButton from "@/components/ruixen/confetti-button";
import { CardSwipe } from "@/components/watermelon/card-swipe";
import { education, ideas, links, pipeline, projects, rounds, skills, stickers, type Project, type Round } from "./data";
import { Figure } from "./Figures";
import { useFgf, type Fgf } from "./fgf";

// only the stickers used here are imported, so the others stay out of the bundle
const ART: Record<string, typeof FlameSticker> = {
  flame: FlameSticker, "star-burst": StarBurstSticker, "cosmic-eye": CosmicEyeSticker, "curious-globe": CuriousGlobeSticker, spiral: SpiralSticker, "eye-splat": EyeSplatSticker,
  "pip-detective": PipDetectiveSticker, "blob-burst": BlobBurstSticker, metal: MetalSticker, "nori-laptop": NoriLaptopSticker, "folded-paper": FoldedPaperSticker,
};

type Personality = (typeof PERSONALITY_NAMES)[number];
const LOOKS: Record<Personality, string> = { sticker: "Sticker", retro: "Retro", comic: "Comic", arcade: "Arcade" };
const TABS = [["play", "Play"], ["projects", "Projects"], ["experience", "Experience"], ["skills", "Skills"], ["ideas", "Ideas"], ["about", "About and contact"]] as const;
type TabId = (typeof TABS)[number][0];

const store = {
  get<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; } },
  set(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ } },
};
const points = (r: Round, guess: number) => Math.round(100 * Math.max(0, 1 - Math.abs(guess - r.answer) / (r.max - r.min)));
const downloadCv = () => { const a = document.createElement("a"); a.href = links.cv; a.download = ""; a.click(); };

/* ---------- progress: guesses made and stickers earned, kept on this browser ---------- */
interface Placed { id: string; x: number; y: number; r: number }
function useGame() {
  const [guesses, setGuesses] = useState<Record<string, number>>(() => store.get("react-guesses", {}));
  const [placed, setPlaced] = useState<Placed[]>(() => store.get("react-stickers", []));
  useEffect(() => store.set("react-guesses", guesses), [guesses]);
  useEffect(() => store.set("react-stickers", placed), [placed]);
  const award = useCallback((id: string) => {
    setPlaced((now) => {
      if (now.some((s) => s.id === id)) return now;
      const s = stickers.find((x) => x.id === id);
      if (s) setTimeout(() => toast.success(`New sticker: ${s.label}`, { description: "It is on your board, in the Play tab. Drag it where you like." }), 0);
      // one slot of a grid per sticker (3 columns on a phone, 4 otherwise), with a little jitter, so they never land on each other
      const cols = innerWidth < 640 ? 3 : 4, slot = now.length % 12;
      return [...now, { id, x: 2 + (slot % cols) * (cols === 3 ? 32 : 24) + Math.random() * 4, y: 2 + Math.floor(slot / cols) * (cols === 3 ? 24 : 31) + Math.random() * 3, r: Math.random() * 24 - 12 }];
    });
  }, []);
  const guess = useCallback((id: string, value: number) => setGuesses((g) => ({ ...g, [id]: value })), []);
  const reset = useCallback(() => { setGuesses({}); setPlaced([]); }, []);
  return { guesses, placed, award, guess, reset };
}
type Game = ReturnType<typeof useGame>;

/* ---------- the board: every sticker earned can be dragged around ---------- */
function Board({ game }: { game: Game }) {
  const ref = useRef<HTMLDivElement>(null);
  const missing = stickers.filter((s) => !game.placed.some((p) => p.id === s.id));
  return (
    <div>
      <div ref={ref} className="board relative h-[560px] overflow-hidden rounded-[var(--plonk-radius-lg)] border-[length:var(--plonk-border-width)] border-ink sm:h-[420px]">
        {game.placed.length === 0 && <p className="absolute inset-0 m-0 grid place-items-center px-8 text-center text-dim">Your sticker board. It is empty: lock in a first guess to earn one.</p>}
        {game.placed.map((p) => {
          const s = stickers.find((x) => x.id === p.id);
          const Art = s && ART[s.art];
          if (!s || !Art) return null;
          return (
            <motion.div key={p.id} drag dragConstraints={ref} dragMomentum={false} dragElastic={0.15} whileDrag={{ scale: 1.15, rotate: 0, zIndex: 5 }}
              initial={{ scale: 0, rotate: p.r - 90 }} animate={{ scale: 1, rotate: p.r }} transition={{ type: "spring", stiffness: 260, damping: 14 }}
              className="absolute w-24 cursor-grab touch-none text-center active:cursor-grabbing" style={{ left: `${p.x}%`, top: `${p.y}%` }} title={`${s.label}: ${s.how}`}>
              <Art size={92} peel aria-hidden="true" />
              <span className="mt-1 block rounded bg-surface px-1 text-xs font-semibold leading-tight">{s.label}</span>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-dim">
        {missing.length === 0 ? "You earned every sticker. Nothing left to find." : <>Still to earn: {missing.map((s) => s.how).join("; ")}.</>}
      </p>
    </div>
  );
}

/* ---------- play: guess a result, then see it ---------- */
function Play({ game, onOpen, go }: { game: Game; onOpen: (id: string) => void; go: (t: TabId) => void }) {
  const [i, setI] = useState(() => Math.max(0, rounds.findIndex((r) => !(r.id in game.guesses))));
  const r = rounds[i], locked = game.guesses[r.id];
  const mid = Math.round((r.min + r.max) / 2 / r.step) * r.step;
  const [value, setValue] = useState(mid);
  const [cont, setCont] = useState(false);
  useEffect(() => setValue(mid), [mid, r.id]);
  const done = rounds.filter((x) => x.id in game.guesses);
  const total = done.reduce((sum, x) => sum + points(x, game.guesses[x.id]), 0);
  const pts = locked != null ? points(r, locked) : 0;

  const lock = () => {
    game.guess(r.id, value);
    game.award(r.sticker);
    if (done.length === rounds.length - 1) setTimeout(() => setCont(true), 1800);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      <div>
        <p className="display m-0 text-[clamp(1.9rem,4.6vw,3.4rem)]">Before you read my results, guess them.</p>
        <p className="mt-3 max-w-xl text-dim">Six questions, each about one thing I built and measured. Every answer earns a sticker, right or wrong.</p>

        <Card className="mt-6" title={`Question ${i + 1} of ${rounds.length}`} actions={locked != null ? <Badge variant={pts >= 90 ? "success" : "warning"}>{pts} points</Badge> : undefined}>
          <p className="m-0 text-lg">{r.question}</p>
          {locked == null ? (
            <div className="mt-8">
              <Slider key={r.id} aria-label="Your guess" min={r.min} max={r.max} step={r.step} value={value} onChange={setValue} formatValue={r.unit} valueBubble="always"
                marks={[{ value: r.min, label: r.unit(r.min) }, { value: r.max, label: r.unit(r.max) }]} />
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="primary" size="lg" onPress={lock}>Lock in {r.unit(value)}</Button>
                <span className="text-sm text-dim">Drag the handle, or use the arrow keys.</span>
              </div>
            </div>
          ) : (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
              <p className="display num m-0 text-[clamp(2.6rem,7vw,4.5rem)] text-amber">{r.unit(r.answer)}</p>
              <p className="mt-2">You said {r.unit(locked)}. {r.reveal}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {i < rounds.length - 1 && <Button variant="primary" onPress={() => setI(i + 1)}>Next question</Button>}
                <Button variant="neutral" onPress={() => (r.project ? onOpen(r.project) : go("experience"))}>{r.project ? "See the project" : "See the internship"}</Button>
              </div>
            </motion.div>
          )}
        </Card>

        <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Questions">
          {rounds.map((x, k) => (
            <Button key={x.id} size="sm" variant={k === i ? "primary" : x.id in game.guesses ? "secondary" : "ghost"} aria-label={`Question ${k + 1}${x.id in game.guesses ? ", answered" : ""}`} onPress={() => setI(k)}>{k + 1}</Button>
          ))}
          {done.length > 0 && <span className="num ml-2 text-sm text-dim">{total} points from {done.length} {done.length === 1 ? "answer" : "answers"}</span>}
          {done.length === rounds.length && <Button size="sm" variant="ghost" onPress={() => { game.reset(); setI(0); }}>Play again</Button>}
        </div>
      </div>
      <Board game={game} />

      <Dialog isOpen={cont} onOpenChange={setCont} title="That was the last question" countdown={9} onCountdownEnd={({ close }) => close()}
        footer={({ close }) => (<><Button variant="ghost" onPress={close}>Keep exploring</Button><Button variant="primary" onPress={() => { close(); go("about"); }}>Get in touch</Button></>)}>
        <p className="m-0">You scored {total} points out of {rounds.length * 100}, and you now know my main results. I'm looking for a 6-month internship or a VIE from February 2027.</p>
      </Dialog>
    </div>
  );
}

/* ---------- projects: a table you can sort, filter and search ---------- */
const kindOf = (p: Project) => (p.kinds.includes("small") ? "Smaller project" : p.kinds.includes("data") && p.kinds.includes("ml") ? "Data and ML" : p.kinds.includes("data") ? "Data engineering" : "Machine learning");

function Projects({ onOpen }: { onOpen: (id: string) => void }) {
  const columns = useMemo(() => {
    const col = createDataTableColumns<Project>();
    return [
      col.accessor("name", { header: "Project", size: 330, cell: (c) => <Button size="sm" variant="neutral" onPress={() => onOpen(c.row.original.id)}>{c.getValue()}</Button> }),
      col.accessor(kindOf, { id: "type", header: "Type", size: 170, meta: { label: "Type", filter: { type: "select" } } }),
      col.accessor((p) => (p.stat ? `${p.stat.value}: ${p.stat.label}` : p.summary), { id: "result", header: "Key result", size: 420, enableSorting: false }),
      col.accessor((p) => p.stack.join(", "), { id: "stack", header: "Stack", size: 320, enableSorting: false }),
    ] as DataTableColumn<Project>[];
  }, [onOpen]);
  return (
    <div>
      <p className="display m-0 text-[clamp(1.9rem,4.6vw,3.4rem)]">Fourteen projects, as a table.</p>
      <p className="mb-6 mt-3 max-w-2xl text-dim">Sort a column, filter by type, or search for a tool such as "Docker" or "dbt". Select a project's name to open it.</p>
      <DataTable aria-label="Projects" data={projects} columns={columns} getRowId={(p) => p.id} searchable columnMenu height={560} rowHeight={64} />
    </div>
  );
}

function ProjectDrawer({ project, fgf, onClose }: { project: Project | null; fgf: Fgf | null; onClose: () => void }) {
  return (
    <Drawer isOpen={project != null} onOpenChange={(o) => { if (!o) onClose(); }} title={project?.name} description={project?.meta} className="sm:max-w-xl">
      {project && (
        <div>
          {project.stat && <p className="display num m-0 text-5xl text-amber">{project.stat.value}<span className="mt-1 block font-sans text-base normal-case tracking-normal text-dim">{project.stat.label}</span></p>}
          {project.body.map((t) => <p key={t.slice(0, 24)} className="my-4">{t}</p>)}
          <p className="flex flex-wrap gap-2">{project.stack.map((s) => <Badge key={s}>{s}</Badge>)}</p>
          {project.fig && <div className="mt-6 border-t border-line pt-6"><Figure kind={project.fig} fgf={fgf} /></div>}
          <p className="mt-6 flex flex-wrap gap-4">
            {project.href && <a href={project.href}>Open the project</a>}
            {project.code && <a href={project.code}>{project.id === "templates" ? "Coursework template" : "Code"}</a>}
          </p>
        </div>
      )}
    </Drawer>
  );
}

/* ---------- experience: step through the pipeline, then race the two dashboards ---------- */
function Race() {
  const [t, setT] = useState<number | null>(null);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const run = () => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const step = (now: number) => { const real = ((now - t0) / 1000) * 60; setT(real); if (real < 10800) raf.current = requestAnimationFrame(step); };
    raf.current = requestAnimationFrame(step);
  };
  const real = t ?? 0, min = Math.floor(real / 60);
  return (
    <div className="mt-6 border-t border-line pt-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="accent" onPress={run}>{t == null ? "Load the dashboard" : "Load it again"}</Button>
        <span className="text-sm text-dim">Sped up 60 times: one second here is one minute of waiting.</span>
      </div>
      <Progress className="mt-4" variant="success" label="With materialised views" value={Math.min(30, real)} max={30} showValue formatValue={() => (t == null ? "30 s" : real < 30 ? `${Math.floor(real)} s` : "Loaded in 30 s")} />
      <Progress className="mt-3" variant="danger" label="Before" value={Math.min(10800, real)} max={10800} showValue formatValue={() => (t == null ? "3 h" : real < 10800 ? `${min < 1 ? `${Math.floor(real)} s` : `${min} min`} of 3 h` : "Loaded in 3 h")} />
    </div>
  );
}

function Experience() {
  const [stage, setStage] = useState(3);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card title="Data and AI engineering intern, CERTAM" description="Rouen, April–August 2026. An applied research centre that tests engines and their emissions.">
        <ul className="m-0 list-disc space-y-3 pl-5">
          <li>Built the ingestion pipeline for vessel telemetry sampled at 1 Hz, from the J1939 CAN bus to PostgreSQL with TimescaleDB.</li>
          <li>Trained a Random Forest that rebuilds particulate readings when the sensor fails (R² up to 0.96), explained it with SHAP and presented it to the test engineers.</li>
          <li>Moved slow dashboard queries into SQL materialised views. The dashboard now loads in 30 seconds; it used to take 3 hours.</li>
          <li>Deployed a Streamlit app and real-time Grafana alerting on a hardened Linux VPS.</li>
        </ul>
        <Race />
      </Card>
      <div className="grid content-start gap-8">
        <Card title="The telemetry pipeline I built" description="Five stages, in order. Step through them.">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pipeline stages">
            {pipeline.map((s, i) => <Button key={s.name} size="sm" variant={i === stage ? "primary" : "neutral"} aria-pressed={i === stage} onPress={() => setStage(i)}>{i + 1}. {s.name}</Button>)}
          </div>
          <Progress className="mt-5" aria-label="Position in the pipeline" value={stage + 1} max={pipeline.length} variant="secondary" />
          <AnimatePresence mode="wait">
            <motion.div key={stage} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }} className="mt-4 min-h-24" aria-live="polite">
              <p className="m-0 text-sm text-dim">{pipeline[stage].tech}</p>
              <p className="m-0 mt-1">{pipeline[stage].detail}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="ghost" isDisabled={stage === 0} onPress={() => setStage(stage - 1)}>Previous stage</Button>
            <Button size="sm" variant="ghost" isDisabled={stage === pipeline.length - 1} onPress={() => setStage(stage + 1)}>Next stage</Button>
          </div>
        </Card>
        <Card title="Data labelling and quality supervisor, Diduenjoy" description="Paris. Internship in July–October 2024, freelance again in August 2025.">
          <ul className="m-0 list-disc space-y-3 pl-5">
            <li>Supervised a team of 5 interns working under a 72-hour SLA, and ran weekly data quality audits.</li>
            <li>Labelled customer verbatims against business taxonomies and measured the precision and recall of the NLP models in production.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ---------- skills: combine several, see what used them all (chips burst, after Watermelon's emoji-spree chips) ---------- */
function Chip({ label, on, toggle }: { label: string; on: boolean; toggle: () => void }) {
  const [burst, setBurst] = useState(0);
  return (
    <span className="relative inline-block">
      <Button size="sm" variant={on ? "primary" : "neutral"} aria-pressed={on} onPress={() => { if (!on) setBurst((b) => b + 1); toggle(); }}>{label}</Button>
      <AnimatePresence>
        {burst > 0 && Array.from({ length: 7 }, (_, k) => {
          const a = (k / 7) * Math.PI * 2 + burst;
          return <motion.i key={`${burst}-${k}`} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 block size-2 rounded-full" style={{ background: k % 2 ? "var(--plonk-color-accent)" : "var(--plonk-color-primary)" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x: Math.cos(a) * 46, y: Math.sin(a) * 34, opacity: 0, scale: 0.3 }} transition={{ duration: 0.55, ease: "easeOut" }} />;
        })}
      </AnimatePresence>
    </span>
  );
}

function Skills({ onOpen, go, award }: { onOpen: (id: string) => void; go: (t: TabId) => void; award: (id: string) => void }) {
  const [sel, setSel] = useState<string[]>([]);
  const uses = useMemo(() => new Map(skills.flatMap((g) => g.items).map(([name, ids]) => [name, ids.split(" ")])), []);
  const all = ["certam", ...projects.map((p) => p.id)];
  const hits = sel.length ? all.filter((id) => sel.every((s) => uses.get(s)?.includes(id))) : [];
  const toggle = (name: string) => { award("skills"); setSel((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name])); };
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
      <div>
        <p className="display m-0 text-[clamp(1.9rem,4.6vw,3.4rem)]">Pick the stack you care about.</p>
        <p className="mt-3 max-w-xl text-dim">Select one skill or several. The panel lists what I built with all of them together.</p>
        {skills.map((g) => (
          <div key={g.group} className="mt-6">
            <h3 className="display m-0 text-xl">{g.group}</h3>
            <div className="mt-3 flex flex-wrap gap-2">{g.items.map(([name]) => <Chip key={name} label={name} on={sel.includes(name)} toggle={() => toggle(name)} />)}</div>
            {g.plain && <p className="mt-2 text-sm text-dim">Also: {g.plain}</p>}
          </div>
        ))}
      </div>
      <Card className="self-start lg:sticky lg:top-6" title={sel.length ? `Built with ${sel.join(" + ")}` : "Nothing selected"} actions={sel.length ? <Button size="sm" variant="ghost" onPress={() => setSel([])}>Clear</Button> : undefined}>
        <div aria-live="polite">
          {!sel.length ? <p className="m-0 text-dim">Select a skill on the left.</p>
            : !hits.length ? <p className="m-0">No single project used all of these together. Remove one to widen the search.</p>
            : <ul className="m-0 flex list-none flex-col gap-2 p-0">{hits.map((id) => {
              const p = projects.find((x) => x.id === id);
              return <motion.li key={id} layout initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}><Button variant="neutral" className="w-full justify-start" onPress={() => (p ? onOpen(p.id) : go("experience"))}>{p ? p.name : "CERTAM internship"}</Button></motion.li>;
            })}</ul>}
        </div>
      </Card>
    </div>
  );
}

/* ---------- ideas: a deck to swipe through ---------- */
function Ideas() {
  const deck = useMemo(() => ideas.flatMap((g) => g.items.map(([name, text]) => ({ when: g.when, name, text }))), []);
  const [i, setI] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(340);
  useEffect(() => {
    const fit = () => setW(Math.min(520, box.current?.clientWidth ?? 340));
    fit(); addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
      <div>
        <p className="display m-0 text-[clamp(1.9rem,4.6vw,3.4rem)]">Twelve ideas I want to build.</p>
        <p className="mt-3 text-dim">Scoped but not built yet. Swipe the cards, or use the buttons. They are ordered by when I expect to start.</p>
        <div className="mt-6 flex items-center gap-3">
          <Button variant="neutral" isDisabled={i === 0} onPress={() => setI(i - 1)}>Previous</Button>
          <Button variant="primary" isDisabled={i === deck.length - 1} onPress={() => setI(i + 1)}>Next idea</Button>
          <span className="num text-sm text-dim" aria-live="polite">{i + 1} of {deck.length}</span>
        </div>
      </div>
      <div ref={box} className="min-w-0">
        <CardSwipe width={w} index={i} onIndex={setI}>
          {deck.map((d, k) => (
            <Card key={d.name} aria-hidden={k !== i} title={d.name} actions={<Badge variant={d.when === "Next" ? "success" : d.when === "Exploring" ? "warning" : "neutral"}>{d.when}</Badge>} className="h-full min-h-72">
              <p className="m-0 select-none">{d.text}</p>
            </Card>
          ))}
        </CardSwipe>
      </div>
    </div>
  );
}

function About({ award }: { award: (id: string) => void }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card title="Get in touch" description="LinkedIn is the quickest way to reach me.">
        <p className="m-0">I'm looking for a 6-month internship or a VIE from February 2027, in data engineering, MLOps, machine learning, AI engineering or data science.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button variant="primary" size="lg" onPress={() => { location.href = links.linkedin; }}>Message me on LinkedIn</Button>
          <ConfettiButton label="Download my CV" sound={false} onClick={() => { award("cv"); downloadCv(); }}
            style={{ background: "var(--plonk-color-accent)", color: "var(--plonk-color-on-accent)", border: "var(--plonk-border-width) solid var(--plonk-color-ink)", fontFamily: "inherit", fontSize: 16, fontWeight: 700, padding: "11px 20px", borderRadius: "var(--plonk-radius-md)" }} />
          <a href={links.github}>GitHub</a>
        </div>
        <p className="mt-6 text-sm text-dim">Last updated on 12 November 2026. Other versions of this portfolio: <a href={links.simple}>simple</a>, <a href={links.interactive}>interactive</a>.</p>
        <p className="text-sm text-dim">Built with Plonk (components and the four styles), Stick It Up (stickers), and pieces adapted from Ruixen UI and Watermelon UI.</p>
      </Card>
      <div>
        <h3 className="display m-0 mb-3 text-2xl">Education</h3>
        <Accordion defaultExpandedKeys={["ESILV"]}>
          {education.map((e) => <AccordionItem key={e.name} id={e.name} title={e.name}><p className="m-0 text-dim">{e.meta}</p><p className="m-0 mt-1">{e.text}</p></AccordionItem>)}
        </Accordion>
      </div>
    </div>
  );
}

export default function App() {
  const fgf = useFgf();
  const game = useGame();
  const { award } = game;
  const [look, setLook] = useState<Personality>(() => { const p = store.get<string>("react-look", "arcade"); return (PERSONALITY_NAMES as readonly string[]).includes(p) ? (p as Personality) : "arcade"; });
  const [tab, setTab] = useState<TabId>("play");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = projects.find((p) => p.id === openId) ?? null;
  const onOpen = useCallback((id: string) => { setOpenId(id); award("reader"); }, [award]);
  const go = useCallback((t: TabId) => { setTab(t); scrollTo({ top: 0 }); }, []);
  const score = game.placed.length;

  useEffect(() => { store.set("react-look", look); document.body.style.backgroundColor = personalities[look].color.canvas; }, [look]);

  return (
    <PlonkProvider personality={look} locale="en-GB" className="app" toastPlacement="bottom-end">
      <header className="mx-auto flex w-full max-w-[1240px] flex-wrap items-end justify-between gap-x-8 gap-y-4 px-4 pb-5 pt-6 sm:px-8">
        <div>
          <ScrambleText as="h1" className="display m-0 text-[clamp(2.2rem,6vw,4rem)]">Clément Vurpillot</ScrambleText>
          <p className="m-0 mt-1 max-w-xl text-dim">Final-year data and AI engineering student at ESILV, Paris. Open to a 6-month internship or VIE from February 2027.</p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Style of the page">
            <span className="text-sm text-dim">Style</span>
            {PERSONALITY_NAMES.map((p) => <Button key={p} size="sm" variant={p === look ? "primary" : "ghost"} aria-pressed={p === look} onPress={() => { setLook(p); if (p !== look) award("look"); }}>{LOOKS[p]}</Button>)}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="accent" className="num">{score} of {stickers.length} stickers</Badge>
            <span onClickCapture={() => award("search")}><CommandPaletteTrigger>Search</CommandPaletteTrigger></span>
            <a className="text-sm" href={links.simple}>Simple version</a>
            <a className="text-sm" href={links.interactive}>Interactive version</a>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 sm:px-8">
        <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(k as TabId)}>
          <TabList aria-label="Sections">{TABS.map(([id, label]) => <Tab key={id} id={id}>{label}</Tab>)}</TabList>
          <TabPanel id="play" className="pt-8"><Play game={game} onOpen={onOpen} go={go} /></TabPanel>
          <TabPanel id="projects" className="pt-8"><Projects onOpen={onOpen} /></TabPanel>
          <TabPanel id="experience" className="pt-8"><Experience /></TabPanel>
          <TabPanel id="skills" className="pt-8"><Skills onOpen={onOpen} go={go} award={award} /></TabPanel>
          <TabPanel id="ideas" className="pt-8"><Ideas /></TabPanel>
          <TabPanel id="about" className="pt-8"><About award={award} /></TabPanel>
        </Tabs>
      </main>

      <ProjectDrawer project={open} fgf={fgf} onClose={() => setOpenId(null)} />

      <CommandPalette placeholder="Search projects, sections and actions" title="Search this portfolio" emptyLabel="Nothing matches. Try a project name or CV." onOpenChange={(o) => { if (o) award("search"); }}>
        <CommandGroup heading="Go to">{TABS.map(([id, label]) => <CommandItem key={id} onAction={() => go(id)}>{label}</CommandItem>)}</CommandGroup>
        <CommandGroup heading="Projects">{projects.map((p) => <CommandItem key={p.id} keywords={p.stack} description={p.summary} onAction={() => onOpen(p.id)}>{p.name}</CommandItem>)}</CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onAction={() => { award("cv"); downloadCv(); }}>Download my CV</CommandItem>
          <CommandItem onAction={() => { location.href = links.linkedin; }}>Message me on LinkedIn</CommandItem>
          <CommandItem onAction={() => { location.href = links.github; }}>Open my GitHub</CommandItem>
          {PERSONALITY_NAMES.map((p) => <CommandItem key={p} keywords={["style", "theme", "look"]} onAction={() => { setLook(p); award("look"); }}>Switch to the {LOOKS[p]} style</CommandItem>)}
          <CommandItem onAction={() => { location.href = links.simple; }}>Read the simple version</CommandItem>
          <CommandItem onAction={() => { location.href = links.interactive; }}>Open the interactive version</CommandItem>
        </CommandGroup>
      </CommandPalette>
    </PlonkProvider>
  );
}
