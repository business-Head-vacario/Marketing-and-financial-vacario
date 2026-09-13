import Link from "next/link";
import type { ReactNode } from "react";
import { cn, gradientFor, initials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = 40,
  ring = false,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  ring?: boolean;
  className?: string;
}) {
  const inner = (
    <span
      className={cn(
        "grid place-items-center overflow-hidden rounded-full bg-gradient-to-br font-semibold text-white",
        gradientFor(name),
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        initials(name)
      )}
    </span>
  );
  if (!ring) return inner;
  return (
    <span className="vc-ring inline-grid place-items-center rounded-full p-[2px]">
      <span className="rounded-full bg-white p-[2px]">{inner}</span>
    </span>
  );
}

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "lagoon";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  full?: boolean;
  title?: string;
};

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "vc-sunset text-white shadow-lg shadow-brand-500/25 hover:brightness-105 active:brightness-95",
  lagoon: "vc-lagoon text-white shadow-lg shadow-lagoon-500/25 hover:brightness-105",
  secondary: "bg-ink-900 text-white hover:bg-ink-800",
  outline: "border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50",
  ghost: "text-ink-700 hover:bg-ink-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  onClick,
  full,
  title,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    full && "w-full",
    className,
  );
  if (href && !disabled) {
    return (
      <Link href={href} className={classes} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "lagoon" | "violet" | "amber" | "emerald" | "rose" | "slate";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-100 text-brand-700",
    lagoon: "bg-lagoon-100 text-lagoon-700",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
    slate: "bg-ink-100 text-ink-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  active,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
        active
          ? "border-transparent vc-sunset text-white shadow-sm"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-600",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  emoji = "🧭",
  title,
  body,
  action,
}: {
  emoji?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="vc-card grid place-items-center gap-3 px-6 py-14 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl vc-sunset text-3xl">{emoji}</div>
      <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
      {body ? <p className="max-w-sm text-sm text-ink-500">{body}</p> : null}
      {action}
    </div>
  );
}

const STAT_TONES: Record<string, string> = {
  brand: "text-brand-600",
  lagoon: "text-lagoon-600",
  violet: "text-violet-600",
  amber: "text-amber-600",
  emerald: "text-emerald-600",
  rose: "text-rose-600",
  ink: "text-ink-900",
};

export function Stat({ label, value, tone = "brand" }: { label: string; value: ReactNode; tone?: keyof typeof STAT_TONES }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white px-4 py-3">
      <div className={cn("font-display text-xl font-extrabold", STAT_TONES[tone] ?? STAT_TONES.brand)}>{value}</div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</div>
    </div>
  );
}

export function VerifiedTick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} aria-label="Verified agency">
      <path
        fill="#0aaeaa"
        d="M12 1.5l2.6 2.2 3.4-.3.9 3.3 2.9 1.8-1.5 3.1 1.5 3.1-2.9 1.8-.9 3.3-3.4-.3L12 22.5l-2.6-2.2-3.4.3-.9-3.3L2.2 15.5 3.7 12.4 2.2 9.3l2.9-1.8.9-3.3 3.4.3z"
      />
      <path fill="#fff" d="M10.8 15.4l-3-3 1.3-1.3 1.7 1.7 4.1-4.1 1.3 1.3z" />
    </svg>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-ink-500">
        {label}
        {required ? <span className="text-brand-500">*</span> : null}
      </span>
      {children}
      {hint && !error ? <span className="mt-1 block text-xs text-ink-400">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs font-semibold text-rose-600">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-ink-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

export function Alert({ tone = "error", children }: { tone?: "error" | "success" | "info"; children: ReactNode }) {
  const tones = {
    error: "border-rose-200 bg-rose-50 text-rose-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    info: "border-sky-200 bg-sky-50 text-sky-700",
  };
  return (
    <div className={cn("rounded-2xl border px-4 py-3 text-sm font-medium", tones[tone])} role="alert">
      {children}
    </div>
  );
}
