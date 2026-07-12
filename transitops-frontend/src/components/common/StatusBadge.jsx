import { cn } from '@/utils/helpers';

const variants = {
  Available: 'bg-green-100 text-green-700 border-green-200',
  'On Trip': 'bg-blue-100 text-blue-700 border-blue-200',
  'In Shop': 'bg-amber-100 text-amber-700 border-amber-200',
  Retired: 'bg-neutral-100 text-neutral-500 border-neutral-200',
  'Off Duty': 'bg-neutral-100 text-neutral-500 border-neutral-200',
  Suspended: 'bg-red-100 text-red-700 border-red-200',
  Draft: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  Dispatched: 'bg-blue-100 text-blue-700 border-blue-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-600 border-red-200',
  Arrived: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Open: 'bg-amber-100 text-amber-700 border-amber-200',
  Closed: 'bg-green-100 text-green-700 border-green-200',
  valid: 'bg-green-100 text-green-700 border-green-200',
  'expiring-soon': 'bg-amber-100 text-amber-700 border-amber-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
};

export default function StatusBadge({ status, className }) {
  const style = variants[status] || 'bg-neutral-100 text-neutral-600 border-neutral-200';
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        style,
        className
      )}
    >
      {status}
    </span>
  );
}
