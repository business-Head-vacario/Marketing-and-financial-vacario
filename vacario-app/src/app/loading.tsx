export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-4 py-6">
      {[0, 1].map((i) => (
        <div key={i} className="vc-card overflow-hidden p-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 animate-pulse rounded-full bg-ink-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 animate-pulse rounded-full bg-ink-100" />
              <div className="h-2.5 w-20 animate-pulse rounded-full bg-ink-100" />
            </div>
          </div>
          <div className="mt-3 aspect-[4/5] w-full animate-pulse rounded-2xl bg-ink-100" />
        </div>
      ))}
    </div>
  );
}
