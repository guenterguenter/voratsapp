import { useRef, useState } from 'react';
import type { FoodItem } from '../types';
import { CATEGORIES } from '../types';
import { FoodIllustration } from './FoodIllustration';
import { getStep, getVelocityStep, isFluid, formatQty, formatDelta } from '../utils';

interface Props {
  item: FoodItem;
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  onQuantityChange: (id: string, delta: number) => void;
}

const STEP_PX = 24; // pixels per one step

export function FoodCard({ item, onEdit, onDelete, onQuantityChange }: Props) {
  const isLow = item.quantity <= item.minQuantity;
  const isEmpty = item.quantity <= 0;

  const dragStartY = useRef<number | null>(null);
  const dragActual = useRef(0);
  const hasDragged = useRef(false);
  // velocity tracking: last 3 pointer events
  const velPoints = useRef<{ y: number; t: number }[]>([]);
  const [dragging, setDragging] = useState(false);
  const [liveActual, setLiveActual] = useState(0);

  function calcVelocity(): number {
    const pts = velPoints.current;
    if (pts.length < 2) return 0;
    const a = pts[0], b = pts[pts.length - 1];
    const dt = b.t - a.t;
    return dt > 0 ? Math.abs(b.y - a.y) / dt : 0; // px/ms
  }

  function startDrag(clientY: number) {
    dragStartY.current = clientY;
    dragActual.current = 0;
    hasDragged.current = false;
    velPoints.current = [{ y: clientY, t: Date.now() }];
    setDragging(true);
    setLiveActual(0);
  }

  function moveDrag(clientY: number) {
    if (dragStartY.current === null) return;
    const dy = dragStartY.current - clientY; // up = positive
    if (Math.abs(dy) > 5) hasDragged.current = true;

    // track velocity
    velPoints.current.push({ y: clientY, t: Date.now() });
    if (velPoints.current.length > 4) velPoints.current.shift();

    // choose step: velocity-based for all L/kg/ml/g, quantity-based for discrete
    const velocity = calcVelocity();
    const step = isFluid(item.unit)
      ? getVelocityStep(velocity, item.quantity, item.unit)
      : getStep(item.quantity, item.unit);

    const segments = Math.round(dy / STEP_PX);
    const actual = segments * step;
    dragActual.current = actual;
    setLiveActual(actual);
  }

  function endDrag() {
    if (dragStartY.current === null) return;
    const delta = dragActual.current;
    dragStartY.current = null;
    velPoints.current = [];
    setDragging(false);
    setLiveActual(0);
    if (delta !== 0) onQuantityChange(item.id, delta);
  }

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
    if (!hasDragged.current) onEdit(item);
  }

  const showDelta = dragging && liveActual !== 0;
  const previewQty = Math.max(0, item.quantity + liveActual);
  const step = getStep(item.quantity, item.unit);

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
        touchAction: 'none',
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

      {/* Drag hint */}
      {!dragging && (
        <div style={{ position: 'absolute', top: 5, right: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: 0.18, fontSize: 8, lineHeight: 1, pointerEvents: 'none' }}>
          <span>▲</span><span>▼</span>
        </div>
      )}

      {/* Delta badge */}
      {showDelta && (
        <div style={{
          position: 'absolute', top: 4, right: 4,
          background: liveActual > 0 ? '#22c55e' : '#ef4444',
          color: 'white', fontSize: 11, fontWeight: 800,
          padding: '2px 7px', borderRadius: 99,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
        }}>
          {formatDelta(liveActual, item.quantity, item.unit)}
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
          transform: dragging
            ? `translateY(${Math.max(-14, Math.min(14, -(liveActual / step) * 2))}px) scale(1.06)`
            : 'none',
          transition: dragging ? 'none' : 'transform 0.2s',
        }}
      >
        <FoodIllustration icon={item.icon} color={item.color} label={item.name} size={54} />
      </div>

      {/* Quantity display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, -step); }}
          style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontWeight: 700, fontSize: 15, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >−</button>
        <span style={{
          fontSize: 11, fontWeight: 700,
          color: showDelta ? (liveActual > 0 ? '#16a34a' : '#dc2626') : '#374151',
          minWidth: 48, textAlign: 'center',
          transition: 'color 0.1s',
        }}>
          {showDelta ? formatQty(previewQty, item.unit) : formatQty(item.quantity, item.unit)}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onQuantityChange(item.id, step); }}
          style={{ width: 24, height: 24, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontWeight: 700, fontSize: 15, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >+</button>
      </div>

      {/* Edit/Delete on hover */}
      <div style={{ display: 'flex', gap: 8, opacity: 0 }} className="group-hover:opacity-100">
        <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} style={{ fontSize: 11, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Bearbeiten</button>
        <span style={{ color: '#d1d5db', fontSize: 11 }}>|</span>
        <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Löschen</button>
      </div>
    </div>
  );
}
