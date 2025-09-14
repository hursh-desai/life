"use client";

import React, { useMemo, useRef, useState } from "react";
import { ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { addYears, yearsBetween, fmt } from "@/lib/time";
import { type EventPoint, type EventRange } from "@/lib/timeline/schema";

type PersonalizedItem = (EventPoint & { absolute: Date }) | (EventRange & { absolute: { start: Date; end: Date } });

export function LifeTimelineCanvas({ birthDate, deathDate, today, items }: {
  birthDate: Date; deathDate: Date; today: Date;
  items: PersonalizedItem[];
}) {
  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[720px]">
          <SvgTimeline birthDate={birthDate} deathDate={deathDate} today={today} items={items}/>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4"/> Tap markers/bands for details. Drag to pan, pinch to zoom.
        </div>
        <div className="sm:ml-auto text-slate-400">(Desktop: hover for details, mouse wheel to zoom, drag to pan)</div>
      </div>
    </div>
  );
}

function SvgTimeline({ birthDate, deathDate, today, items }: {
  birthDate: Date; deathDate: Date; today: Date;
  items: PersonalizedItem[];
}) {
  const WIDTH = 1200;
  const HEIGHT = 300;
  const PAD = 32;
  const TRACK_Y = 150;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [hover, setHover] = useState<null | { x: number; y: number; item: PersonalizedItem }>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchCenter, setLastTouchCenter] = useState<{x: number, y: number} | null>(null);

  const spanYears = yearsBetween(birthDate, deathDate);

  const ticks = useMemo(() => {
    const arr: { age: number; date: Date }[] = [];
    const base = spanYears > 80 ? 10 : spanYears > 40 ? 5 : 2;
    const step = Math.max(1, Math.round(base / Math.sqrt(scale)));
    for (let a = 0; a <= Math.ceil(spanYears); a += step) arr.push({ age: a, date: addYears(birthDate, a) });
    return arr;
  }, [birthDate, spanYears, scale]);

  const xForDate = (d: Date) => {
    const age = yearsBetween(birthDate, d);
    const base = PAD + (WIDTH - PAD * 2) * (age / spanYears);
    return base * scale + tx;
  };

  // Precompute range lanes to avoid overlap
  const rangeLanes = useMemo(() => {
    const lanes: { x1: number; x2: number; lane: number }[] = [];
    const map = new Map<number, number>();
    items.forEach((e, idx) => {
      const isPoint = (e as any).absolute instanceof Date;
      if (isPoint) return;
      const x1 = xForDate((e as any).absolute.start);
      const x2 = xForDate((e as any).absolute.end);
      const a = Math.min(x1, x2);
      const b = Math.max(x1, x2);
      let lane = 0;
      while (lanes.some(l => l.lane === lane && !(b < l.x1 || a > l.x2))) lane++;
      lanes.push({ x1: a, x2: b, lane });
      map.set(idx, lane);
    });
    return map;
  }, [items, scale, tx, birthDate, deathDate]);

  const onWheel: React.WheelEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    const mouseX = rect ? e.clientX - rect.left : 0;
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    const next = Math.max(0.5, Math.min(6, scale * factor));
    const k = next / scale;
    setTx(mouseX - k * (mouseX - tx));
    setScale(next);
  };

  const onMouseDown: React.MouseEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startTx = tx;
    const move = (ev: MouseEvent) => setTx(startTx + (ev.clientX - startX));
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return null;
    const t1 = touches[0];
    const t2 = touches[1];
    return Math.sqrt(Math.pow(t2.clientX - t1.clientX, 2) + Math.pow(t2.clientY - t1.clientY, 2));
  };

  const getTouchCenter = (touches: TouchList) => {
    if (touches.length < 2) return null;
    const t1 = touches[0];
    const t2 = touches[1];
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2
    };
  };

  const onTouchStart: React.TouchEventHandler<SVGSVGElement> = (e) => {
    if (e.touches.length === 1) {
      // Single touch - start pan
      setIsDragging(true);
      const touch = e.touches[0];
      const rect = svgRef.current?.getBoundingClientRect();
      const startX = touch.clientX - (rect?.left || 0);
      const startTx = tx;
      const move = (ev: TouchEvent) => {
        if (ev.touches.length === 1) {
          const touch = ev.touches[0];
          const currentX = touch.clientX - (rect?.left || 0);
          setTx(startTx + (currentX - startX));
        }
      };
      const end = () => {
        setIsDragging(false);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
      };
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", end);
    } else if (e.touches.length === 2) {
      // Two touches - start pinch
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      if (distance && center) {
        setLastTouchDistance(distance);
        setLastTouchCenter(center);
      }
    }
  };

  const onTouchMove: React.TouchEventHandler<SVGSVGElement> = (e) => {
    if (e.touches.length === 2 && lastTouchDistance && lastTouchCenter) {
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      const newCenter = getTouchCenter(e.touches);
      if (newDistance && newCenter) {
        // Zoom
        const factor = newDistance / lastTouchDistance;
        const nextScale = Math.max(0.5, Math.min(6, scale * factor));
        const k = nextScale / scale;

        // Pan to keep the pinch center fixed
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          const centerX = newCenter.x - rect.left;
          setTx(centerX - k * (centerX - tx));
        }

        setScale(nextScale);
        setLastTouchDistance(newDistance);
        setLastTouchCenter(newCenter);
      }
    }
  };

  const onTouchEnd: React.TouchEventHandler<SVGSVGElement> = (e) => {
    if (e.touches.length === 0) {
      setLastTouchDistance(null);
      setLastTouchCenter(null);
    }
  };

  const zoomIn = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    const centerX = rect ? rect.width / 2 : 0;
    const factor = 1.2;
    const next = Math.max(0.5, Math.min(6, scale * factor));
    const k = next / scale;
    setTx(centerX - k * (centerX - tx));
    setScale(next);
  };

  const zoomOut = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    const centerX = rect ? rect.width / 2 : 0;
    const factor = 1 / 1.2;
    const next = Math.max(0.5, Math.min(6, scale * factor));
    const k = next / scale;
    setTx(centerX - k * (centerX - tx));
    setScale(next);
  };

  const axisX1 = PAD * scale + tx;
  const axisX2 = (WIDTH - PAD) * scale + tx;

  return (
    <div className="relative w-full h-[300px]">
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-[300px] touch-none"
           onWheel={onWheel} onMouseDown={onMouseDown}
           onMouseLeave={() => setHover(null)}
           onTouchStart={(e) => {
             // Clear tooltip on touch if not on an interactive element
             if (!isDragging) {
               setHover(null);
             }
             onTouchStart(e);
           }}
           onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <line x1={axisX1} y1={TRACK_Y} x2={axisX2} y2={TRACK_Y} className="stroke-slate-300" strokeWidth={2} />
      {ticks.map((t, i) => (
        <g key={i} transform={`translate(${xForDate(t.date)}, ${TRACK_Y})`}>
          <line y1={-6} y2={6} className="stroke-slate-300" strokeWidth={1} />
          <text y={20} className="fill-slate-600 text-[10px]" textAnchor="middle">{t.age}y</text>
          <text y={34} className="fill-slate-400 text-[9px]" textAnchor="middle">{t.date.getFullYear()}</text>
        </g>
      ))}

      {today >= birthDate && today <= deathDate && (
        <g transform={`translate(${xForDate(today)}, 0)`}>
          <line x1={0} y1={20} x2={0} y2={HEIGHT-20} className="stroke-sky-500" strokeWidth={2} strokeDasharray="4 3">
            <animate attributeName="stroke-opacity" values="1;0.6;1" dur="2s" repeatCount="indefinite" />
          </line>
          <rect x={-48} y={24} width={96} height={20} rx={6} className="fill-sky-50 stroke-sky-300"/>
          <text x={0} y={38} textAnchor="middle" className="fill-sky-700 text-[11px]">Today</text>
        </g>
      )}

      {items.map((e, idx) => {
        const isPoint = (e as any).absolute instanceof Date;
        if (isPoint) {
          const x = xForDate((e as any).absolute);
          const importance = (e as any).importance ?? 2;
          const r = importance === 1 ? 4 : importance === 2 ? 5 : 7;
          return (
            <g key={idx} transform={`translate(${x}, 0)`}>
              <circle cx={0} cy={TRACK_Y} r={r} className={e.kind === "bio" ? "fill-emerald-500" : "fill-indigo-500"}
                      onMouseEnter={(ev)=>setHover({ x: ev.clientX, y: ev.clientY, item: e })}
                      onMouseMove={(ev)=>setHover({ x: ev.clientX, y: ev.clientY, item: e })}
                      onMouseLeave={()=>setHover(null)}
                      onTouchStart={(ev)=> {
                        ev.preventDefault();
                        const rect = svgRef.current?.getBoundingClientRect();
                        if (rect) {
                          setHover({ x: ev.touches[0].clientX, y: ev.touches[0].clientY, item: e });
                        }
                      }} />
            </g>
          );
        } else {
          const x1 = xForDate((e as any).absolute.start);
          const x2 = xForDate((e as any).absolute.end);
          const importance = (e as any).importance ?? 2;
          const height = importance === 1 ? 10 : importance === 2 ? 12 : 14;
          const opacity = importance === 1 ? 0.6 : importance === 2 ? 0.8 : 1;
          const lane = rangeLanes.get(idx) ?? 0;
          const dir = e.kind === "bio" ? -1 : 1;
          const y = TRACK_Y + dir * (34 + lane * 18);
          return (
            <g key={idx}>
              <rect x={Math.min(x1, x2)} y={y - height/2} width={Math.abs(x2 - x1)} height={height} rx={height/2}
                    className={e.kind === "bio" ? "fill-emerald-100 stroke-emerald-300" : "fill-indigo-100 stroke-indigo-300"}
                    style={{ opacity }}
                    onMouseEnter={(ev)=>setHover({ x: ev.clientX, y: ev.clientY, item: e })}
                    onMouseMove={(ev)=>setHover({ x: ev.clientX, y: ev.clientY, item: e })}
                    onMouseLeave={()=>setHover(null)}
                    onTouchStart={(ev)=> {
                      ev.preventDefault();
                      const rect = svgRef.current?.getBoundingClientRect();
                      if (rect) {
                        setHover({ x: ev.touches[0].clientX, y: ev.touches[0].clientY, item: e });
                      }
                    }} />
              <text x={(x1 + x2) / 2} y={y - (dir === -1 ? (height/2 + 4) : (height/2 + 4))} textAnchor="middle" className="text-[11px] fill-slate-700 font-medium">{e.label}</text>
            </g>
          );
        }
      })}

      <g transform={`translate(${WIDTH - 220}, 24)`}>
        <rect x={0} y={0} width={200} height={48} rx={10} className="fill-white stroke-slate-200"/>
        <circle cx={18} cy={16} r={5} className="fill-emerald-500"/>
        <rect x={12} y={28} width={40} height={8} rx={4} className="fill-emerald-100 stroke-emerald-300"/>
        <text x={60} y={20} className="text-[11px] fill-slate-700">Biological</text>
        <circle cx={138} cy={16} r={5} className="fill-indigo-500"/>
        <rect x={132} y={28} width={40} height={8} rx={4} className="fill-indigo-100 stroke-indigo-300"/>
        <text x={60} y={36} className="text-[11px] fill-slate-700">Sociological</text>
      </g>
      </svg>

      {/* Mobile zoom controls */}
      <div className="md:hidden absolute top-2 right-2 flex flex-col gap-1">
        <button
          onClick={zoomIn}
          className="bg-white/90 hover:bg-white border border-slate-300 rounded-full p-2 shadow-sm transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-slate-700" />
        </button>
        <button
          onClick={zoomOut}
          className="bg-white/90 hover:bg-white border border-slate-300 rounded-full p-2 shadow-sm transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {hover && (
        <div style={{ position: "fixed", left: hover.x + 12, top: hover.y + 12, zIndex: 50 }}
             className="pointer-events-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow">
          <div className="font-semibold text-slate-900">{hover.item.label}</div>
          {((hover.item as any).absolute instanceof Date) ? (
            <div className="text-slate-600">{fmt((hover.item as any).absolute)} • {(hover.item as any).note ?? ((hover.item as any).kind === 'bio' ? 'Biological' : 'Sociological')}</div>
          ) : (
            <div className="text-slate-600">{fmt((hover.item as any).absolute.start)} → {fmt((hover.item as any).absolute.end)}{(hover.item as any).note ? ` • ${(hover.item as any).note}` : ''}</div>
          )}
        </div>
      )}
    </div>
  );
}

