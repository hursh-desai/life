"use client";

import React, { useMemo, useState } from "react";
import { Info, Calendar, Clock, ChevronRight } from "lucide-react";

import { LifeTimelineCanvas } from "@/components/timeline/LifeTimelineCanvas";
import { ControlsPanel } from "@/components/timeline/ControlsPanel";
import { eventsToPersonalized } from "@/lib/timeline/personalize";
import { HARD_CODED_EVENTS, isRange, type EventPoint, type EventRange } from "@/lib/timeline/schema";
import { addYears, yearsBetween, fmt } from "@/lib/time";

export default function Page() {
  const [birthStr, setBirthStr] = useState("1995-01-01");
  const [mode, setMode] = useState<"lifespan" | "deathdate">("lifespan");
  const [lifespan, setLifespan] = useState(85);
  const [deathStr, setDeathStr] = useState("2080-01-01");
  const [showBio, setShowBio] = useState(true);
  const [showSoc, setShowSoc] = useState(true);

  const birthDate = useMemo(() => new Date(birthStr), [birthStr]);
  const deathDate = useMemo(() => {
    if (mode === "deathdate") return new Date(deathStr);
    return addYears(birthDate, lifespan);
  }, [mode, deathStr, birthDate, lifespan]);

  const today = new Date();

  const filtered = useMemo(
    () => HARD_CODED_EVENTS.filter(e => (e.kind === "bio" && showBio) || (e.kind === "soc" && showSoc)),
    [showBio, showSoc]
  );

  const personalized = useMemo(() => eventsToPersonalized(filtered, birthDate), [filtered, birthDate]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6 sm:mb-8 flex items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Memento: Personal Timeline</h1>
            <p className="text-slate-600 mt-1 flex items-start sm:items-center gap-2"><Info className="w-4 h-4 mt-0.5 sm:mt-0"/> Enter your birth date and a lifespan or death date. We’ll overlay biological and sociological milestones as a visual timeline.</p>
          </div>
        </header>

        <ControlsPanel
          birthStr={birthStr}
          setBirthStr={setBirthStr}
          mode={mode}
          setMode={setMode}
          lifespan={lifespan}
          setLifespan={setLifespan}
          deathStr={deathStr}
          setDeathStr={setDeathStr}
          showBio={showBio}
          setShowBio={setShowBio}
          showSoc={showSoc}
          setShowSoc={setShowSoc}
          today={today}
          birthDate={birthDate}
          deathDate={deathDate}
        />

        <div className="mt-6 sm:mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm p-3 sm:p-4">
          <LifeTimelineCanvas
            birthDate={birthDate}
            deathDate={deathDate}
            today={today}
            items={personalized}
          />
        </div>

        <div className="mt-5 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Milestones as Dates</h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {personalized.map((e, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs sm:text-sm uppercase tracking-wide text-slate-500">{e.kind === "bio" ? "Biological" : "Sociological"}</div>
                <div className="font-medium">{e.label}</div>
                {isRange(e as any) ? (
                  <div className="text-xs sm:text-sm text-slate-700">{fmt((e as any).absolute.start)} → {fmt((e as any).absolute.end)}</div>
                ) : (
                  <div className="text-xs sm:text-sm text-slate-700">{fmt((e as any).absolute)}</div>
                )}
                {("note" in e && e.note) && <div className="text-[11px] sm:text-xs text-slate-500 mt-1">{e.note}</div>}
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-8 sm:mt-10 text-center text-[11px] sm:text-xs text-slate-500">
          Built as a prototype. Milestones are generalized and optional—not destiny. Future versions: add personal data, regional norms, custom overlays, and uncertainty bands.
        </footer>
      </div>
    </div>
  );
}

