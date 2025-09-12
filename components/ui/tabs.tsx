"use client";

import React from "react";

type TabsContextValue = { value: string; setValue: (v: string) => void };
const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({ value, onValueChange, className = "", children }: { value: string; onValueChange: (v: string) => void; className?: string; children: React.ReactNode }) {
  return <TabsContext.Provider value={{ value, setValue: onValueChange }}><div className={className}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`inline-flex rounded-md border border-slate-300 bg-white p-1 ${className}`} {...props} />;
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-1.5 text-sm rounded ${active ? "bg-slate-900 text-white" : "text-slate-700"}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className = "", children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}

