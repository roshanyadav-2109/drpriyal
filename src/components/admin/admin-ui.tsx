import { cn } from "@/lib/utils";

export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-sand bg-paper p-6 shadow-[var(--shadow-soft)]">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-2 font-serif text-3xl text-pine">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-sand bg-paper p-6 shadow-[var(--shadow-soft)]", className)}>
      {title && <h2 className="mb-4 font-serif text-xl">{title}</h2>}
      {children}
    </div>
  );
}

export function NotConnected({ feature }: { feature: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-sand bg-bone/40 p-8 text-center">
      <p className="font-medium text-ink">Connect Supabase to manage {feature}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
        Add your <code className="rounded bg-bone px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and run
        the migration in <code className="rounded bg-bone px-1">supabase/migrations</code>. Until
        then, this view shows seeded sample content.
      </p>
    </div>
  );
}
