import type { ReactNode } from "react";

type DynamicListProps<T> = {
  items: readonly T[];
  getKey: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
  itemClassName?: string;
};

/** Renders a responsive, data-driven collection with a consistent empty state. */
export function DynamicList<T>({
  items,
  getKey,
  renderItem,
  emptyState = <p className="py-12 text-center text-textSecondary">Nothing to show yet.</p>,
  className = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
  itemClassName,
}: DynamicListProps<T>) {
  if (items.length === 0) return <>{emptyState}</>;

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div className={itemClassName} key={getKey(item, index)}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

export default DynamicList;

