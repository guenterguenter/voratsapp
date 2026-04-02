import { useState, useEffect } from 'react';
import type { FoodItem, Category } from '../types';
import { CATEGORIES, UNITS } from '../types';
import { FoodIllustration } from './FoodIllustration';

export const ICON_OPTIONS = [
  { value: 'flour',   label: 'Mehlsack',    emoji: '🌾' },
  { value: 'sugar',   label: 'Zuckerdose',  emoji: '🍬' },
  { value: 'pasta',   label: 'Nudeln',      emoji: '🍝' },
  { value: 'oil',     label: 'Ölflasche',   emoji: '🫒' },
  { value: 'milk',    label: 'Milchkarton', emoji: '🥛' },
  { value: 'can',     label: 'Dose',        emoji: '🥫' },
  { value: 'rice',    label: 'Reisbeutel',  emoji: '🌾' },
  { value: 'salt',    label: 'Salzstreuer', emoji: '🧂' },
  { value: 'jar',     label: 'Glas',        emoji: '🍯' },
  { value: 'bottle',  label: 'Flasche',     emoji: '🍶' },
  { value: 'box',     label: '3D-Karton',   emoji: '📦' },
  { value: 'default', label: 'Karton',      emoji: '📦' },
];

const COLOR_PRESETS = [
  '#fef3c7', '#fde68a', '#fef9c3',
  '#ffe4e6', '#fecdd3', '#fce7f3',
  '#d1fae5', '#a7f3d0', '#ecfdf5',
  '#eff6ff', '#dbeafe', '#e0f2fe',
  '#f3e8ff', '#ede9fe', '#fdf4ff',
  '#fff7ed', '#fed7aa', '#fdba74',
  '#f1f5f9', '#e2e8f0', '#f9fafb',
];

interface Props {
  item?: FoodItem | null;
  onSave: (item: FoodItem) => void;
  onClose: () => void;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function ItemModal({ item, onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('sonstiges');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Packung');
  const [minQuantity, setMinQuantity] = useState(1);
  const [icon, setIcon] = useState('default');
  const [color, setColor] = useState('#fef3c7');
  const [expiryDate, setExpiryDate] = useState('');
  const [customColor, setCustomColor] = useState('#fef3c7');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setQuantity(item.quantity);
      setUnit(item.unit);
      setMinQuantity(item.minQuantity);
      setIcon(item.icon);
      setColor(item.color);
      setCustomColor(item.color);
      setExpiryDate(item.expiryDate ?? '');
    }
  }, [item]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: item?.id ?? generateId(),
      name: name.trim(),
      category,
      quantity,
      unit,
      minQuantity,
      icon,
      color,
      addedAt: item?.addedAt ?? new Date().toISOString(),
      expiryDate: expiryDate || undefined,
    });
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto' }}>
        <div style={{ padding: 24 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111' }}>
              {item ? 'Artikel bearbeiten' : 'Neuer Artikel'}
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: '#9ca3af', lineHeight: 1 }}>×</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Live Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px', background: '#f9fafb', borderRadius: 12 }}>
              <FoodIllustration icon={icon} color={color} label={name || 'Vorschau'} size={100} />
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Weizenmehl"
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Kategorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', fontSize: 14, outline: 'none', background: 'white' }}
              >
                {(Object.entries(CATEGORIES) as [Category, { label: string; emoji: string }][]).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.emoji} {cat.label}</option>
                ))}
              </select>
            </div>

            {/* Quantity + Unit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Menge</label>
                <input
                  type="number" value={quantity} min={0} step={0.5}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Einheit</label>
                <select
                  value={unit} onChange={(e) => setUnit(e.target.value)}
                  style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', fontSize: 14, outline: 'none', background: 'white' }}
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Min quantity */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                Mindestmenge <span style={{ fontWeight: 400, color: '#9ca3af' }}>(Warngrenze)</span>
              </label>
              <input
                type="number" value={minQuantity} min={0} step={0.5}
                onChange={(e) => setMinQuantity(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Expiry */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                Ablaufdatum <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
              </label>
              <input
                type="date" value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '8px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {/* Illustration picker */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Packungsform</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIcon(opt.value)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      padding: '6px 4px', borderRadius: 10,
                      border: `2px solid ${icon === opt.value ? '#3b82f6' : '#f3f4f6'}`,
                      background: icon === opt.value ? '#eff6ff' : 'white',
                      cursor: 'pointer', transition: 'border-color 0.1s',
                    }}
                  >
                    <FoodIllustration icon={opt.value} color={color} label="" size={36} />
                    <span style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', lineHeight: 1.2 }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Packungsfarbe</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setColor(c); setCustomColor(c); }}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', border: `2.5px solid ${color === c ? '#374151' : 'transparent'}`,
                      background: c, cursor: 'pointer',
                      transform: color === c ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.1s',
                      outline: color === c ? '2px solid white' : 'none',
                      outlineOffset: -4,
                    }}
                  />
                ))}
              </div>
              {/* Custom color input */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => { setCustomColor(e.target.value); setColor(e.target.value); }}
                  style={{ width: 36, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer', padding: 2, background: 'none' }}
                />
                <span style={{ fontSize: 12, color: '#6b7280' }}>Eigene Farbe wählen</span>
                <code style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{color}</code>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button
                type="button" onClick={onClose}
                style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: '1.5px solid #e5e7eb', background: 'white', color: '#374151', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                style={{ flex: 1, padding: '10px 16px', borderRadius: 12, border: 'none', background: '#3b82f6', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                {item ? 'Speichern' : 'Hinzufügen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
