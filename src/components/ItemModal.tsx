import { useState, useEffect } from 'react';
import type { FoodItem, Category } from '../types';
import { CATEGORIES, UNITS } from '../types';
import { FoodIllustration } from './FoodIllustration';

const ICON_OPTIONS = [
  { value: 'flour', label: 'Mehlsack' },
  { value: 'sugar', label: 'Zuckerdose' },
  { value: 'pasta', label: 'Nudelpackung' },
  { value: 'oil', label: 'Ölflasche' },
  { value: 'milk', label: 'Milchkarton' },
  { value: 'can', label: 'Konserve' },
  { value: 'rice', label: 'Reisbeutel' },
  { value: 'salt', label: 'Salzstreuer' },
  { value: 'default', label: 'Karton' },
];

const COLOR_OPTIONS = [
  '#fef3c7', '#ffe4e6', '#fef9c3', '#d1fae5',
  '#eff6ff', '#fee2e2', '#f0fdf4', '#e0f2fe',
  '#fce7f3', '#f3e8ff', '#ecfdf5', '#fff7ed',
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
  const [color, setColor] = useState('#f3f4f6');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setQuantity(item.quantity);
      setUnit(item.unit);
      setMinQuantity(item.minQuantity);
      setIcon(item.icon);
      setColor(item.color);
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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {item ? 'Artikel bearbeiten' : 'Neuer Artikel'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Preview */}
            <div className="flex justify-center py-2">
              <FoodIllustration icon={icon} color={color} size={80} />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Weizenmehl"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                {(Object.entries(CATEGORIES) as [Category, { label: string; emoji: string }][]).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity + Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menge</label>
                <input
                  type="number"
                  value={quantity}
                  min={0}
                  step={0.5}
                  onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Einheit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Min quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mindestmenge <span className="text-gray-400 font-normal">(Warngrenze)</span>
              </label>
              <input
                type="number"
                value={minQuantity}
                min={0}
                step={0.5}
                onChange={(e) => setMinQuantity(parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Expiry date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ablaufdatum <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Icon selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Illustration</label>
              <div className="grid grid-cols-3 gap-2">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIcon(opt.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                      icon === opt.value ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <FoodIllustration icon={opt.value} color={color} size={40} />
                    <span className="text-xs text-gray-500">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Farbe</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      color === c ? 'border-gray-700 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm font-bold"
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
