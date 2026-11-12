import { useState } from "react";
import { motion } from "motion/react";
import type { Fig } from "./data";
import { hourLabel, type Fgf } from "./Trace";

const ease = [0.2, 0.7, 0.2, 1] as const;
const Caption = ({ children }: { children: React.ReactNode }) => <p className="mt-3 text-sm text-dim">{children}</p>;

function Waffle() {
  return (
    <div>
      <div className="grid max-w-md grid-cols-11 gap-1.5" role="img" aria-label="36 of the 88 sacks with a chip had the chipping player open.">
        {Array.from({ length: 88 }, (_, i) => (
          <motion.span key={i} className="aspect-square rounded-[3px] border border-line"
            initial={{ backgroundColor: "rgba(0,0,0,0)" }}
            animate={i < 36 ? { backgroundColor: "var(--amber)", borderColor: "var(--amber)" } : {}}
            transition={{ delay: 0.25 + i * 0.025, duration: 0.2 }} whileHover={{ scale: 1.35 }} />
        ))}
      </div>
      <Caption>Each square is one sack. Amber: the player who chipped was open (at least 3 yards past the line for at least 1 second). Open: 36. Not open: 52.</Caption>
    </div>
  );
}

function Lol() {
  const rows: [string, number][] = [["KDA", 60.3], ["Elo per team", 63.8], ["Elo per player", 63.8], ["LoL Ratings 3.0", 65.4]];
  return (
    <div>
      <div className="grid grid-cols-[max-content_1fr_max-content] items-center gap-x-4 gap-y-3 text-sm" role="img" aria-label="Games called correctly in 2026: KDA 60.3 percent, Elo per team 63.8, Elo per player 63.8, LoL Ratings 3.0 65.4.">
        {rows.map(([name, v], i) => (
          <div key={name} className="contents">
            <span>{name}</span>
            <span className="relative h-5 border-b border-dashed border-line">
              <motion.i className="absolute top-1/2 -ml-2 -mt-2 block size-4 rounded-full" style={{ background: i === 3 ? "var(--amber)" : "var(--dim)" }}
                initial={{ left: "0%" }} animate={{ left: `${((v - 58) / 9) * 100}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.9, ease }} />
            </span>
            <span className="num font-medium">{v.toFixed(1)} %</span>
          </div>
        ))}
        <span /><span className="flex justify-between text-xs text-dim"><span>58 %</span><span>67 %</span></span><span />
      </div>
      <Caption>8,566 pro games the model never saw while it was built. The Elo ratings are updated after every game, which favours them; my model is only retrained once a month.</Caption>
    </div>
  );
}

function Trip() {
  const rows: [string, string, number, boolean][] = [["rank_bm25", "77 s", 100, false], ["Sparse matrix product", "0.6 s", 0.78, true]];
  return (
    <div>
      <div className="grid grid-cols-[max-content_1fr_max-content] items-center gap-x-4 gap-y-3 text-sm" role="img" aria-label="BM25 scoring time: 77 seconds with rank_bm25, 0.6 seconds with the sparse matrix product.">
        {rows.map(([name, label, w, mine], i) => (
          <div key={name} className="contents">
            <span>{name}</span>
            <span className="h-4"><motion.i className="block h-full min-w-[3px] origin-left rounded-r" style={{ width: `${w}%`, background: mine ? "var(--amber)" : "var(--dim)" }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 + i * 0.4, duration: 0.9, ease }} /></span>
            <span className="num font-medium">{label}</span>
          </div>
        ))}
      </div>
      <Caption>Scoring 900 × 900 places, same scale for both bars. Same scores as rank_bm25.</Caption>
    </div>
  );
}

function Arch() {
  const box = "rounded-lg border border-line px-2 py-2 text-center text-xs leading-snug";
  const mine = "border-amber bg-[var(--glow)]";
  return (
    <div>
      <div className="grid grid-cols-2 gap-3" role="img" aria-label="The browser talks to an Nginx gateway and load balancer, which sends traffic to two replicas of each API. Each API has its own PostgreSQL database on its own Docker network. The gateway and the networks were my part.">
        <div className={`${box} col-span-2 mx-auto w-2/3`}><b className="block text-sm">Browser</b>single-page app</div>
        <div className={`${box} ${mine} col-span-2 mx-auto w-2/3`}><b className="block text-sm">Nginx gateway</b>serves the front end, balances /api1 and /api2</div>
        {[["api1 × 2", "FastAPI, JWT", "crypto_auth"], ["api2 × 2", "FastAPI, CoinGecko data", "crypto_index"]].map(([api, tech, db]) => (
          <div key={api} className="grid gap-3 rounded-xl border border-dashed border-amber p-2">
            <div className={box}><b className="block text-sm">{api}</b>{tech}</div>
            <div className={box}><b className="block text-sm">PostgreSQL</b>{db}</div>
          </div>
        ))}
      </div>
      <Caption>Amber: my part, the gateway and load balancer, and the networking between each API and its database.</Caption>
    </div>
  );
}

function FgfChart({ data }: { data: Fgf | null }) {
  const days = data ? Math.floor(data.a.length / 24) : 0;
  const [day, setDay] = useState(-1);
  const [hover, setHover] = useState<number | null>(null);
  if (!data) return <Caption>The chart needs the data published with the simple version, which could not be loaded here.</Caption>;
  const from = (day < 0 ? days - 7 : day) * 24, N = 168;
  const a = data.a.slice(from, from + N), m = data.m.slice(from, from + N);
  const all = a.concat(m).filter((v): v is number => v != null);
  const lo = Math.floor(Math.min(...all) / 50) * 50, hi = Math.ceil(Math.max(...all) / 50) * 50;
  const X0 = 30, X1 = 636, Y0 = 8, Y1 = 190;
  const x = (i: number) => X0 + (i / (N - 1)) * (X1 - X0), y = (v: number) => Y1 - ((v - lo) / (hi - lo)) * (Y1 - Y0);
  const path = (s: (number | null)[]) => { let d = "", pen = false; s.forEach((v, i) => { if (v == null) { pen = false; return; } d += `${pen ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`; pen = true; }); return d; };
  let e = 0, n = 0;
  a.forEach((v, i) => { const f = m[i]; if (v != null && f != null) { e += Math.abs(f - v) / v; n++; } });
  const hv = hover != null ? a[hover] : null, hf = hover != null ? m[hover] : null;
  return (
    <div>
      <p className="mb-1 flex flex-wrap gap-x-5 text-sm text-dim" aria-hidden="true">
        <span><i className="mr-2 inline-block w-5 border-t-2 border-teal align-middle" />Consumed</span>
        <span><i className="mr-2 inline-block w-5 border-t-2 border-dotted border-amber align-middle" />My day-ahead forecast</span>
      </p>
      <svg viewBox="0 0 640 214" className="block w-full cursor-crosshair overflow-visible" style={{ touchAction: "pan-y" }} role="img"
        aria-label="France's hourly electricity consumption against my day-ahead forecast, seven days at a time."
        onPointerMove={(ev) => { const r = ev.currentTarget.getBoundingClientRect(); setHover(Math.max(0, Math.min(N - 1, Math.round((((ev.clientX - r.left) / r.width) * 640 - X0) / (X1 - X0) * (N - 1))))); }}
        onPointerLeave={() => setHover(null)}>
        {[lo, (lo + hi) / 2, hi].map((v) => (
          <g key={v}><line x1={X0} x2={X1} y1={y(v)} y2={y(v)} stroke="var(--line)" /><text x={X0 - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--dim)">{(v / 10).toFixed(0)}</text></g>
        ))}
        {Array.from({ length: 7 }, (_, d) => <text key={d} x={x(d * 24 + 12)} y={210} textAnchor="middle" fontSize="11" fill="var(--dim)">{hourLabel(data, from + d * 24 + 12).split(",").slice(0, 1).join("")}</text>)}
        <motion.path key={`a${from}`} d={path(a)} fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease }} />
        <path d={path(m)} fill="none" stroke="var(--amber)" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" />
        {hover != null && hv != null && hf != null && (
          <g><line x1={x(hover)} x2={x(hover)} y1={Y0} y2={Y1} stroke="var(--dim)" /><circle cx={x(hover)} cy={y(hv)} r="4.5" fill="var(--teal)" /><circle cx={x(hover)} cy={y(hf)} r="4.5" fill="var(--amber)" /></g>
        )}
      </svg>
      <p className="num mt-2 min-h-[3em] text-sm" aria-live="polite">
        {hover == null ? `Mean hourly error over these 7 days: ${((e / n) * 100).toFixed(1)} %. Values in GW; move over the chart to read an hour.`
          : hv == null || hf == null ? `${hourLabel(data, from + hover)}: the run was missed that day.`
          : `${hourLabel(data, from + hover)}: ${(hv / 10).toFixed(1)} GW consumed, ${(hf / 10).toFixed(1)} GW forecast (${((Math.abs(hf - hv) / hv) * 100).toFixed(1)} % off).`}
      </p>
      <label className="mt-1 flex items-center gap-3 text-sm text-dim">Slide through the days
        <input type="range" min={0} max={days - 7} value={day < 0 ? days - 7 : day} onChange={(ev) => setDay(+ev.target.value)} className="min-w-0 flex-1 accent-[var(--amber)]" />
      </label>
    </div>
  );
}

export function Figure({ kind, fgf }: { kind: Fig; fgf: Fgf | null }) {
  if (kind === "waffle") return <Waffle />;
  if (kind === "lol") return <Lol />;
  if (kind === "trip") return <Trip />;
  if (kind === "arch") return <Arch />;
  return <FgfChart data={fgf} />;
}
