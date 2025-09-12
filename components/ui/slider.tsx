"use client";

import React from "react";

type Props = {
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onValueChange: (v: number[]) => void;
};

export function Slider({ min = 0, max = 100, step = 1, value, onValueChange }: Props) {
  const v = value[0] ?? min;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={v}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className="w-full"
    />
  );
}

