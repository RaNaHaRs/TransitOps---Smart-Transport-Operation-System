import { cn } from '@/utils/helpers';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-neutral-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-400 max-w-xs mb-5">{description}</p>}
      {action && action}
    </div>
  );
}
