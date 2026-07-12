import { cn } from '@/utils/helpers';

export default function KPICard({ title, value, unit = '', icon: Icon, trend, color = 'blue', subtitle }) {
  const colorMap = {
    blue: { bg: 'bg-primary-50', icon: 'bg-primary-100 text-primary-600', value: 'text-primary-700' },
    green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', value: 'text-green-700' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', value: 'text-amber-700' },
    red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-600', value: 'text-red-700' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', value: 'text-purple-700' },
    slate: { bg: 'bg-neutral-50', icon: 'bg-neutral-100 text-neutral-600', value: 'text-neutral-700' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className={cn('rounded-xl p-5 border border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow')}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 leading-none">
            {value ?? '—'}
            {unit && <span className="text-sm font-medium text-neutral-500 ml-1">{unit}</span>}
          </p>
          {subtitle && <p className="text-xs text-neutral-400 mt-1.5">{subtitle}</p>}
          {trend !== undefined && trend !== null && (
            <p className={cn('text-xs font-medium mt-2', trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-neutral-400')}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', c.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
