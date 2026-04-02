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
      style={{
        position: 'relative',
        borderRadius: 16,
        padding: '12px 8px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        background: isEmpty ? '#fff1f2' : isLow ? '#fffbeb' : 'white',
        border: `2px solid ${isEmpty ? '#fecdd3' : isLow ? '#fde68a' : 'transparent'}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.15s',
        cursor: 'pointer',
      }}
      className="group hover:shadow-md"
    >
      {/* Status badge */}
      {isEmpty && (
        <div style={{ position: 'absolute', top: 6, right: 6, background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>Leer</div>
      )}
      {isLow && !isEmpty && (
        <div style={{ position: 'absolute', top: 6, right: 6, background: '#f59e0b', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>Wenig</div>
      )}

      {/* Category emoji */}
      <div style={{ position: 'absolute', top: 7, left: 7, fontSize: 11, opacity: 0.6 }}>
        {CATEGORIES[item.category].emoji}
      </div>

      {/* Illustration with name on label */}
      <div onClick={() => onEdit(item)} style={{ marginTop: 4 }}>
        <FoodIllustration icon={item.icon} color={item.color} label={item.name} size={76} />
      </div>

      {/* Quantity controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <button
          onClick={() => onQuantityChange(item.id, -1)}
          style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >−</button>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', minWidth: 52, textAlign: 'center' }}>
          {item.quantity} {item.unit}
        </span>
        <button
          onClick={() => onQuantityChange(item.id, 1)}
          style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >+</button>
      </div>

      {/* Edit/Delete on hover */}
      <div style={{ display: 'flex', gap: 8, opacity: 0 }} className="group-hover:opacity-100" >
        <button onClick={() => onEdit(item)} style={{ fontSize: 11, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Bearbeiten</button>
        <span style={{ color: '#d1d5db', fontSize: 11 }}>|</span>
        <button onClick={() => onDelete(item.id)} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Löschen</button>
      </div>
    </div>
  );
}
