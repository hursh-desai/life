import React from "react";

type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: Props) {
  return <label className={`text-sm font-medium text-slate-700 ${className}`} {...props} />;
}

