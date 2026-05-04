import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle";
}

export function Card({
  variant = "default",
  children,
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    default:
      "bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow",
    elevated:
      "bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow",
    subtle: "bg-slate-950 rounded-2xl p-4",
  };

  return (
    <div {...props} className={`${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
