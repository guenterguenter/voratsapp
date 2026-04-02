import { useRef, useState } from 'react';
import type { FoodItem } from '../types';
import { CATEGORIES } from '../types';
import { FoodIllustration } from './FoodIllustration';

interface Props {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
}

const STEP_PX = 22; // pixels per 1 unit change

export function FoodCard({ item, onEdit, onDelete, onQuantityChange }: Props) {
  const isLow = item.quantity <= item.minQuantity;
  const isEmpty = item.quantity <= 0;

  const dragStartY = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const hasDragged = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [dragDisplay, setDragDisplay] = useState(0); // visual delta shown during drag

  function startDrag(clientY: number) {
    dragStartY.current = clientY;
    dragDelta.current = 0;
    hasDragged.current = false;
    setDragging(true);
    setDragDisplay(0);
  }

  function moveDrag(clientY: number) {
    if (dragStartY.current === null) return;
    const dy = dragStartY.current - clientY; // up = positive
    const delta = Math.round(dy / STEP_PX);
    if (Math.abs(dy) > 4) hasDragged.current = true;
    dragDelta.current = delta;
    setDragDisplay(delta);
  }

  function endDrag() {
    if (dragStartY.current === null) return;
    const delta = dragDelta.current;
    dragStartY.current = null;
    setDragging(false);
    setDragDisplay(0);
    if (delta !== 0) {
      onQuantityChange(item.id, delta);
    }
  }

  // Pointer events (works for both mouse and touch)
  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    startDrag(e.clientY);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragStartY.current === null) return;
    moveDrag(e.clientY);
  }
  function onPointerUp(_e: React.PointerEvent) {
    endDrag();
    // Only open edit if it was a tap (no drag)
    if (!hasDragged.current) {
      onEdit(item);
    }
  }

  const showDelta = dragging && dragDisplay !== 0;
  const previewQty = Math.max(0, item.quantity + dragDisplay);

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
        border: `2px solid ${dragging ? '#3b82f6' : isEmpty ? '#fecdd3' : isLow ? '#fde68a' : 'transparent'}`,
        boxShadow: dragging ? '0 8px 24px rgba(59,130,246,0.2)' : '0 1px 4px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.15s, border-color 0.1s',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none', // prevent scroll while dragging
      }}
      className="group"
    >
      {/* Status badge */}
      {isEmpty && !dragging && (
        <div style={{ position: 'absolute', top: 6, right: 6, background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>Leer</div>
      )}
      {isLow && !isEmpty && !dragging && (
        <div style={{ position: 'absolute', top: 6, right: 6, background: '#f59e0b', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>Wenig</div>
      )}

      {/* Category emoji */}
      <div style={{ position: 'absolute', top: 7, left: 7, fontSize: 11, opacity: 0.6 }}>
        {CATEGORIES[item.category].emoji}
      </div>

      {/* Drag hint arrow */}
      {!dragging && (
        <div style={{
          position: 'absolute', top: 5, right: 6,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          opacity: 0.18, fontSize: 8, lineHeight: 1,
          pointerEvents: 'none',
        }}>
          <span>▲</span>
          <span>▼</span>
        </div>
      )}

      {/* Delta badge while dragging */}
      {showDelta && (
        <div style={{
          position: 'absolute', top: 4, right: 4,
          background: dragDisplay > 0 ? '#22c55e' : '#ef4444',
          color: 'white', fontSize: 13, fontWeight: 800,
          padding: '2px 8px', borderRadius: 99,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          {dragDisplay > 0 ? `+${dragDisplay}` : dragDisplay}
        </div>
      )}

      {/* Illustration — drag target */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={endDrag}
        style={{
          marginTop: 4,
          cursor: dragging ? 'ns-resize' : 'grab',
          transform: dragging ? `translateY(${Math.max(-16, Math.min(16, -dragDisplay * 2))}px) scale(1.06)` : 'none',
          transition: dragging ? 'none' : 'transform 0.2s',
        }}
      >
        <FoodIllustration icon={item.icon} color={item.color} label={item.name} size={76} />
      </div>

      {/* Quantity display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, -1); }}
          style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >−</button>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: showDelta ? (dragDisplay > 0 ? '#16a34a' : '#dc2626') : '#374151',
          minWidth: 52, textAlign: 'center',
          transition: 'color 0.1s',
        }}>
          {showDelta ? `${previewQty} ${item.unit}` : `${item.quantity} ${item.unit}`}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, 1); }}
          style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >+</button>
      </div>

      {/* Edit/Delete (hover only) */}
      <div style={{ display: 'flex', gap: 8, opacity: 0 }} className="group-hover:opacity-100">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(item); }}
          style={{ fontSize: 11, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >Bearbeiten</button>
        <span style={{ color: '#d1d5db', fontSize: 11 }}>|</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >Löschen</button>
      </div>
    </div>
  );
}
