import type { FoodItem } from '../types';
import { CATEGORIES } from '../types';
import { FoodIllustration } from './FoodIllustration';

interface Props {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
}

export function FoodCard({ item, onEdit, onDelete, onQuantityChange }: Props) {
  const isLow = item.quantity <= item.minQuantity;
  const isEmpty = item.quantity <= 0;

  return (
    <div
      className={`relative rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm border-2 transition-all hover:shadow-md cursor-pointer group ${
        isEmpty
          ? 'border-red-300 bg-red-50 opacity-70'
          : isLow
          ? 'border-amber-300 bg-amber-50'
          : 'border-transparent bg-white'
      }`}
      style={{ minWidth: 0 }}
    >
      {/* Low stock badge */}
      {isLow && !isEmpty && (
        <div className="absolute top-2 right-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          Wenig
        </div>
      )}
      {isEmpty && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          Leer
        </div>
      )}

      {/* Category badge */}
      <div className="absolute top-2 left-2 text-xs text-gray-400">
        {CATEGORIES[item.category].emoji}
      </div>

      {/* Illustration */}
      <div
        className="mt-2"
        onClick={() => onEdit(item)}
        title="Bearbeiten"
      >
        <FoodIllustration icon={item.icon} color={item.color} size={72} />
      </div>

      {/* Name */}
      <div className="font-semibold text-gray-800 text-sm text-center leading-tight">
        {item.name}
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onQuantityChange(item.id, -1)}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg leading-none transition-colors"
          aria-label="Reduzieren"
        >
          −
        </button>
        <span className="text-sm font-bold text-gray-700 min-w-[3rem] text-center">
          {item.quantity} {item.unit}
        </span>
        <button
          onClick={() => onQuantityChange(item.id, 1)}
          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg leading-none transition-colors"
          aria-label="Erhöhen"
        >
          +
        </button>
      </div>

      {/* Actions (show on hover) */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(item)}
          className="text-xs text-blue-500 hover:text-blue-700 underline"
        >
          Bearbeiten
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => onDelete(item.id)}
          className="text-xs text-red-400 hover:text-red-600 underline"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}
