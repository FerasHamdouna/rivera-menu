export function Loading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="جاري التحميل">
      {[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-gold/15" />)}
    </div>
  );
}

export function PageTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h1 className="font-display text-2xl font-bold">{children}</h1>
      {action}
    </div>
  );
}
