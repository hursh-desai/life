"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock } from "lucide-react";
import { yearsBetween, addYears, fmt } from "@/lib/time";

type Props = {
  birthStr: string; setBirthStr: (v: string) => void;
  mode: "lifespan" | "deathdate"; setMode: (v: "lifespan" | "deathdate") => void;
  lifespan: number; setLifespan: (v: number) => void;
  deathStr: string; setDeathStr: (v: string) => void;
  showBio: boolean; setShowBio: (v: boolean) => void;
  showSoc: boolean; setShowSoc: (v: boolean) => void;
  today: Date;
  birthDate: Date; deathDate: Date;
};

export function ControlsPanel(props: Props) {
  const { birthStr, setBirthStr, mode, setMode, lifespan, setLifespan, deathStr, setDeathStr, showBio, setShowBio, showSoc, setShowSoc, today, birthDate, deathDate } = props;

  return (
    <Card className="rounded-2xl shadow-sm border-slate-200">
      <CardContent className="p-4 sm:p-6 grid md:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-4 md:col-span-2">
          <div className="grid gap-4 items-end sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Birth date</Label>
              <Input type="date" value={birthStr} onChange={e=>setBirthStr(e.target.value)} />
            </div>

            <Tabs value={mode} onValueChange={(v)=>setMode(v as any)} className="sm:col-span-2">
              <TabsList className="grid grid-cols-2 text-xs sm:text-sm">
                <TabsTrigger value="lifespan">I think I’ll live to (years)</TabsTrigger>
                <TabsTrigger value="deathdate">I want to use a specific death date</TabsTrigger>
              </TabsList>
              <TabsContent value="lifespan" className="pt-3 sm:pt-4">
                <div className="grid grid-cols-[1fr_auto] gap-3 sm:gap-4 items-center">
                  <div className="px-1 sm:px-2">
                    <Slider min={30} max={120} step={1} value={[lifespan]} onValueChange={(v)=>setLifespan(v[0])}/>
                  </div>
                  <Input type="number" className="w-20 sm:w-24" value={lifespan} onChange={e=>setLifespan(parseInt(e.target.value || "0"))}/>
                </div>
              </TabsContent>
              <TabsContent value="deathdate" className="pt-3 sm:pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Death date</Label>
                    <Input type="date" value={deathStr} onChange={e=>setDeathStr(e.target.value)} />
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div>Computed lifespan: <strong>{Math.max(0, Math.round(yearsBetween(birthDate, new Date(deathStr))))}</strong> years</div>
                    <div className="text-xs">(Change above fields to update)</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1 sm:pt-2">
            <div className="flex items-center gap-2">
              <Switch checked={showBio} onCheckedChange={setShowBio} id="bio"/>
              <Label htmlFor="bio">Biological milestones</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showSoc} onCheckedChange={setShowSoc} id="soc"/>
              <Label htmlFor="soc">Sociological milestones</Label>
            </div>
            <div className="sm:ml-auto text-xs sm:text-sm text-slate-600 flex items-center gap-2"><Clock className="w-4 h-4"/> Today: {fmt(today)} · Age {Math.max(0, Math.min(150, yearsBetween(birthDate, today))).toFixed(1)}</div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 sm:p-4 space-y-2">
          <div className="text-xs sm:text-sm text-slate-600">Your personalized window</div>
          <div className="text-base sm:text-lg font-semibold">{fmt(birthDate)} → {fmt(deathDate)}</div>
          <div className="text-sm">Total span: <strong>{Math.max(0, Math.round(yearsBetween(birthDate, deathDate)))}</strong> years</div>
          <div className="text-sm">Projected 50% mark: <strong>{fmt(addYears(birthDate, Math.floor(yearsBetween(birthDate, deathDate)/2)))}</strong></div>
          <div className="text-[11px] sm:text-xs text-slate-500">These are coarse heuristics; you’ll be able to customize and add your own overlays in a later iteration.</div>
        </div>
      </CardContent>
    </Card>
  );
}

