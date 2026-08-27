import { cn } from "../../utils";

export function Card({ className, children }) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm border border-slate-100", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("px-6 py-4 border-b border-slate-50", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn("text-lg font-semibold text-slate-800", className)}>{children}</h3>;
}

export function CardContent({ className, children }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}
