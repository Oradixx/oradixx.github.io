import { useState, type ReactNode } from "react";
import { motion, useMotionValue, useTransform, type MotionValue, type PanInfo } from "motion/react";

/*
 * Adapted from Watermelon UI's "card-swipe" (registry.watermelon.sh/r/card-swipe.json).
 * Kept: the drag-to-page mechanics and the page-turn rotation of each card.
 * Changed: cards take any content, the width follows the container, the index is controlled
 * from outside (so buttons and keys can page too), and the colours come from the page.
 */
const GAP = 16;
const SPRING = { type: "spring" as const, stiffness: 330, damping: 30 };

function Page({ index, x, span, children }: { index: number; x: MotionValue<number>; span: number; children: ReactNode }) {
  const rotateY = useTransform(x, [-(index + 1) * span, -index * span, -(index - 1) * span], [70, 0, -70], { clamp: false });
  const opacity = useTransform(x, [-(index + 1) * span, -index * span, -(index - 1) * span], [0.2, 1, 0.2]);
  return <motion.div style={{ width: span - GAP, rotateY, opacity, flexShrink: 0 }} className="cursor-grab active:cursor-grabbing">{children}</motion.div>;
}

export function CardSwipe({ width, index, onIndex, children }: { width: number; index: number; onIndex: (i: number) => void; children: ReactNode[] }) {
  const x = useMotionValue(0);
  const [dragging, setDragging] = useState(false);
  const span = width + GAP, last = children.length - 1;
  const end = (_: unknown, info: PanInfo) => {
    setDragging(false);
    if (info.offset.x < -50 || info.velocity.x < -500) onIndex(Math.min(index + 1, last));
    else if (info.offset.x > 50 || info.velocity.x > 500) onIndex(Math.max(index - 1, 0));
  };
  return (
    <div className="overflow-hidden py-3" style={{ width, touchAction: "pan-y" }}>
      <motion.div className="flex" drag="x" dragConstraints={{ left: -span * last, right: 0 }} onDragStart={() => setDragging(true)} onDragEnd={end}
        style={{ gap: GAP, x, perspective: 1000, perspectiveOrigin: `${index * span + width / 2}px 50%`, pointerEvents: dragging ? "none" : undefined }}
        animate={{ x: -index * span }} transition={SPRING}>
        {children.map((c, i) => <Page key={i} index={i} x={x} span={span}>{c}</Page>)}
      </motion.div>
    </div>
  );
}
