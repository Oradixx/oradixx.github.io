import { useEffect, useRef, useState } from "react";

export interface Fgf { start: number; a: (number | null)[]; m: (number | null)[] }

// The forecast data lives in the simple version's page; read it from there so it exists once.
export function useFgf(): Fgf | null {
  const [data, setData] = useState<Fgf | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("../index.html")
      .then((r) => r.text())
      .then((t) => {
        const node = new DOMParser().parseFromString(t, "text/html").getElementById("fgfData");
        const d = JSON.parse(node?.textContent ?? "null");
        if (alive && d?.a?.length >= 168) setData({ start: Date.parse(d.start), a: d.a, m: d.m });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return data;
}

const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
export const hourLabel = (d: Fgf, h: number) => fmt.format(d.start + h * 36e5);

const NOW = 0.62; // where "now" sits, as a share of the width
const AHEAD = 24; // the forecast is published a day ahead

/** Hero background: a replay of France's consumption, with the day-ahead forecast running in front of it. */
export function Trace({ data, onRead }: { data: Fgf; onRead: (hour: number) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const read = useRef(onRead);
  read.current = onRead;

  useEffect(() => {
    const cv = ref.current!, ctx = cv.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vals = data.a.concat(data.m).filter((v): v is number => v != null);
    const lo = Math.min(...vals), hi = Math.max(...vals), n = data.a.length;
    let pos = Math.min(n - AHEAD - 1, 96), raf = 0, last = 0, lastHour = -1, visible = true, frame = 0;
    let teal = "", amber = "", line = "";
    const colors = () => { const s = getComputedStyle(document.documentElement); teal = s.getPropertyValue("--teal"); amber = s.getPropertyValue("--amber"); line = s.getPropertyValue("--line"); };

    const at = (arr: (number | null)[], h: number) => {
      const i = Math.floor(h), a = arr[i], b = arr[Math.min(n - 1, i + 1)];
      return a == null || b == null ? null : a + (b - a) * (h - i);
    };

    function draw(t: number) {
      raf = requestAnimationFrame(draw);
      if (!visible) { last = t; return; }
      if (frame++ % 40 === 0) colors();
      const dt = last ? Math.min(0.1, (t - last) / 1000) : 0;
      last = t;
      if (!reduced) pos += dt * 1.6;
      if (pos > n - AHEAD - 1) pos = 96;

      const dpr = Math.min(devicePixelRatio || 1, 2), W = cv.clientWidth, H = cv.clientHeight;
      if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const SPAN = Math.max(54, Math.min(132, W / 9.5)); // hours on screen
      const x = (h: number) => W * NOW + ((h - pos) / SPAN) * W;
      const y = (v: number) => H * 0.64 - ((v - lo) / (hi - lo)) * H * 0.38;
      const first = Math.max(0, Math.floor(pos - SPAN * NOW) - 1);

      // midnights
      ctx.strokeStyle = line; ctx.lineWidth = 1;
      for (let h = Math.ceil(first / 24) * 24; h < pos + SPAN * (1 - NOW); h += 24) { ctx.beginPath(); ctx.moveTo(x(h), H * 0.2); ctx.lineTo(x(h), H); ctx.stroke(); }

      const path = (arr: (number | null)[], to: number) => {
        let pen = false;
        ctx.beginPath();
        for (let h = first; h <= to; h++) {
          const v = arr[h];
          if (v == null) { pen = false; continue; }
          if (pen) ctx.lineTo(x(h), y(v)); else ctx.moveTo(x(h), y(v));
          pen = true;
        }
        const end = at(arr, to);
        if (pen && end != null) ctx.lineTo(x(to), y(end));
      };

      // forecast first: it reaches a day past "now"
      ctx.setLineDash([2, 6]); ctx.lineCap = "round"; ctx.lineWidth = 2; ctx.strokeStyle = amber;
      path(data.m, Math.min(n - 1, pos + AHEAD)); ctx.stroke();
      ctx.setLineDash([]);

      // what was really consumed, up to "now"
      ctx.lineWidth = 2.2; ctx.strokeStyle = teal; ctx.lineJoin = "round";
      path(data.a, pos); ctx.stroke();
      const g = ctx.createLinearGradient(0, H * 0.3, 0, H);
      g.addColorStop(0, teal); g.addColorStop(1, "transparent");
      ctx.lineTo(x(pos), H); ctx.lineTo(x(first), H); ctx.closePath();
      ctx.globalAlpha = 0.13; ctx.fillStyle = g; ctx.fill(); ctx.globalAlpha = 1;

      const now = at(data.a, pos);
      if (now != null) {
        ctx.fillStyle = teal; ctx.beginPath(); ctx.arc(x(pos), y(now), 5, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(x(pos), y(now), 11 + Math.sin(t / 300) * 3, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
      }
      const hour = Math.floor(pos);
      if (hour !== lastHour) { lastHour = hour; read.current(hour); }
    }

    const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; });
    io.observe(cv);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [data]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" style={{ maskImage: "linear-gradient(to bottom, #000 58%, transparent 88%)", WebkitMaskImage: "linear-gradient(to bottom, #000 58%, transparent 88%)" }} />;
}
