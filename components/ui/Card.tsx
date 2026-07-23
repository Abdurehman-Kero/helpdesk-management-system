import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export function Card({ children, className = "", title, subtitle, headerAction }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-xs ${className}`}>
      {(title || headerAction) && (
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
