import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={`h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200 ${className}`}
      {...props}
    />
  );
}

