import { useEffect, useState } from "react";

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
