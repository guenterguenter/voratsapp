import { useState, useEffect, useMemo } from 'react';
import type { FoodItem, Category } from './types';
import { CATEGORIES, DEFAULT_ITEMS } from './types';
import { FoodCard } from './components/FoodCard';
import { ItemModal } from './components/ItemModal';
import './index.css';

const STORAGE_KEY = 'voratsapp_items';

function loadItems(): FoodItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS;
  } catch {
    return DEFAULT_ITEMS;
  }
}

function saveItems(items: FoodItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

type ViewMode = 'grid' | 'shelf';
type SortMode = 'name' | 'category' | 'quantity';

export default function App() {
  const [items, setItems] = useState<FoodItem[]>(loadItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<FoodItem | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('category');
  const [showOnlyLow, setShowOnlyLow] = useState(false);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  function handleSave(item: FoodItem) {
    setItems((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.map((i) => (i.id === item.id ? item : i))
        : [...prev, item]
    );
    setModalOpen(false);
    setEditItem(null);
  }

  function handleDelete(id: string) {
    if (confirm('Artikel wirklich löschen?')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  function handleQuantityChange(id: string, delta: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
      )
    );
  }

  function handleEdit(item: FoodItem) {
    setEditItem(item);
    setModalOpen(true);
  }

  const filtered = useMemo(() => {
    let result = items;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q));
    }
    if (filterCategory !== 'all') {
      result = result.filter((i) => i.category === filterCategory);
    }
    if (showOnlyLow) {
      result = result.filter((i) => i.quantity <= i.minQuantity);
    }
    return result.sort((a, b) => {
      if (sortMode === 'name') return a.name.localeCompare(b.name);
      if (sortMode === 'quantity') return a.quantity - b.quantity;
      return a.category.localeCompare(b.category);
    });
  }, [items, search, filterCategory, showOnlyLow, sortMode]);

  const stats = useMemo(() => ({
    total: items.length,
    low: items.filter((i) => i.quantity <= i.minQuantity && i.quantity > 0).length,
    empty: items.filter((i) => i.quantity === 0).length,
    expiringSoon: items.filter((i) => {
      if (!i.expiryDate) return false;
      const days = (new Date(i.expiryDate).getTime() - Date.now()) / 86400000;
      return days >= 0 && days <= 7;
    }).length,
  }), [items]);

  const grouped = useMemo(() => {
    if (sortMode !== 'category') return { '': filtered };
    return filtered.reduce<Record<string, FoodItem[]>>((acc, item) => {
      const cat = CATEGORIES[item.category].label;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [filtered, sortMode]);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fef9f0 0%, #fff8f0 100%)' }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #fde9c6',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>🏠</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>
              Vorrats&shy;app
            </h1>
            <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>Mein Zuhause-Vorrat</p>
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => { setEditItem(null); setModalOpen(true); }}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              padding: '8px 16px',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Hinzufügen
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Artikel', value: stats.total, color: '#1a1a1a', bg: 'white' },
            { label: 'Wenig vorrätig', value: stats.low, color: stats.low > 0 ? '#d97706' : '#9ca3af', bg: stats.low > 0 ? '#fffbeb' : 'white' },
            { label: 'Leer', value: stats.empty, color: stats.empty > 0 ? '#ef4444' : '#9ca3af', bg: stats.empty > 0 ? '#fef2f2' : 'white' },
            { label: 'Bald abgelaufen', value: stats.expiringSoon, color: stats.expiringSoon > 0 ? '#f97316' : '#9ca3af', bg: stats.expiringSoon > 0 ? '#fff7ed' : 'white' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: stat.bg,
              borderRadius: 16,
              padding: '12px 8px',
              textAlign: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Suchen..."
            style={{
              flex: '1 1 160px',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '8px 12px',
              fontSize: 14,
              background: 'white',
              outline: 'none',
            }}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as Category | 'all')}
            style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '8px 12px', fontSize: 14, background: 'white', outline: 'none' }}
          >
            <option value="all">Alle Kategorien</option>
            {(Object.entries(CATEGORIES) as [Category, { label: string; emoji: string }][]).map(([key, cat]) => (
              <option key={key} value={key}>{cat.emoji} {cat.label}</option>
            ))}
          </select>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: '8px 12px', fontSize: 14, background: 'white', outline: 'none' }}
          >
            <option value="category">Nach Kategorie</option>
            <option value="name">Nach Name</option>
            <option value="quantity">Nach Menge</option>
          </select>
          <button
            onClick={() => setShowOnlyLow((v) => !v)}
            style={{
              border: showOnlyLow ? '1px solid #f59e0b' : '1px solid #e5e7eb',
              borderRadius: 12,
              padding: '8px 12px',
              fontSize: 13,
              fontWeight: 600,
              background: showOnlyLow ? '#fef3c7' : 'white',
              color: showOnlyLow ? '#b45309' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            ⚠️ Nur wenige
          </button>
          <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
            {(['grid', 'shelf'] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                style={{
                  padding: '8px 14px',
                  fontSize: 16,
                  border: 'none',
                  background: viewMode === m ? '#3b82f6' : 'transparent',
                  color: viewMode === m ? 'white' : '#6b7280',
                  cursor: 'pointer',
                }}
                title={m === 'grid' ? 'Rasteransicht' : 'Listenansicht'}
              >
                {m === 'grid' ? '⊞' : '≡'}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
            <p style={{ color: '#9ca3af', fontSize: 18, margin: 0 }}>
              {items.length === 0 ? 'Noch keine Artikel. Fang an!' : 'Keine Artikel gefunden.'}
            </p>
            {items.length === 0 && (
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  marginTop: 16,
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                Ersten Artikel hinzufügen
              </button>
            )}
          </div>
        )}

        {/* Grid view */}
        {viewMode === 'grid' && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat}>
                {cat && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 16 }}>{catItems[0] && CATEGORIES[catItems[0].category]?.emoji}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat}</span>
                    <span style={{ fontSize: 12, color: '#d1d5db' }}>({catItems.length})</span>
                  </div>
                )}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 12,
                }}>
                  {catItems.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onQuantityChange={handleQuantityChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shelf / List view */}
        {viewMode === 'shelf' && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Object.entries(grouped).map(([cat, catItems]) => (
              <div key={cat} style={{ background: 'white', borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                {cat && (
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{catItems[0] && CATEGORIES[catItems[0].category]?.emoji}</span>
                    <span style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>{cat}</span>
                    <span style={{ color: '#9ca3af', fontSize: 13 }}>({catItems.length})</span>
                  </div>
                )}
                {catItems.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 16px',
                      borderBottom: idx < catItems.length - 1 ? '1px solid #f9fafb' : 'none',
                      opacity: item.quantity === 0 ? 0.6 : 1,
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{CATEGORIES[item.category].emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{CATEGORIES[item.category].label}</div>
                    </div>
                    {item.expiryDate && (
                      <span style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 99,
                        background: new Date(item.expiryDate).getTime() - Date.now() < 7 * 86400000 ? '#fff7ed' : '#f3f4f6',
                        color: new Date(item.expiryDate).getTime() - Date.now() < 7 * 86400000 ? '#c2410c' : '#6b7280',
                      }}>
                        {new Date(item.expiryDate).toLocaleDateString('de-DE')}
                      </span>
                    )}
                    {item.quantity <= item.minQuantity && item.quantity > 0 && (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#fef3c7', color: '#92400e', fontWeight: 600 }}>Wenig</span>
                    )}
                    {item.quantity === 0 && (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: '#fee2e2', color: '#991b1b', fontWeight: 600 }}>Leer</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleQuantityChange(item.id, -1)} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>−</button>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', minWidth: 72, textAlign: 'center' }}>{item.quantity} {item.unit}</span>
                      <button onClick={() => handleQuantityChange(item.id, 1)} style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', fontWeight: 700, fontSize: 16 }}>+</button>
                    </div>
                    <button onClick={() => handleEdit(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18 }} title="Bearbeiten">✎</button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', fontSize: 16 }} title="Löschen">✕</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ItemModal
          item={editItem}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
        />
      )}
    </div>
  );
}
