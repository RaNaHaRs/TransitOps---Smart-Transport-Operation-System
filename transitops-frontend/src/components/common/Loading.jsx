import { cn } from '@/utils/helpers';

export default function Loading({ fullPage = false, text = 'Loading...' }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-[3px] border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-neutral-400">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center py-16')}>
      {spinner}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-neutral-100">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-neutral-200 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
