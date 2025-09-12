"use client";

import React from "react";

type Props = {
  id?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
};

export function Switch({ id, checked, onCheckedChange }: Props) {
  return (
    <label className="inline-flex items-center cursor-pointer" htmlFor={id}>
      <input id={id} type="checkbox" className="sr-only" checked={checked} onChange={e=>onCheckedChange(e.target.checked)} />
      <span className={`h-6 w-10 rounded-full transition-colors ${checked ? "bg-slate-900" : "bg-slate-300"} relative`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : ""}`}></span>
      </span>
    </label>
  );
}

