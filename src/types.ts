export type Category = 'backen' | 'getreide' | 'konserven' | 'getraenke' | 'milch' | 'gewuerze' | 'sonstiges';

export interface FoodItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  minQuantity: number;
  icon: string;
  color: string;
  addedAt: string;
  expiryDate?: string;
}

export const CATEGORIES: Record<Category, { label: string; emoji: string }> = {
  backen: { label: 'Backen', emoji: '🥐' },
  getreide: { label: 'Getreide & Pasta', emoji: '🌾' },
  konserven: { label: 'Konserven', emoji: '🥫' },
  getraenke: { label: 'Getränke', emoji: '🥤' },
  milch: { label: 'Milch & Eier', emoji: '🥛' },
  gewuerze: { label: 'Gewürze & Öle', emoji: '🧂' },
  sonstiges: { label: 'Sonstiges', emoji: '🛒' },
};

export const UNITS = ['g', 'kg', 'ml', 'L', 'Stück', 'Packung', 'Dose', 'Flasche', 'Tüte', 'Glas'];

export const ITEM_COLORS: Record<string, string> = {
  mehl: '#f5e6c8',
  zucker: '#fef3c7',
  salz: '#e0f2fe',
  reis: '#fef9c3',
  pasta: '#fde68a',
  olivenoel: '#d1fae5',
  milch: '#eff6ff',
  eier: '#fef3c7',
  default: '#f3f4f6',
};

export const DEFAULT_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Mehl',
    category: 'backen',
    quantity: 2,
    unit: 'kg',
    minQuantity: 1,
    icon: 'flour',
    color: '#fef3c7',
    addedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Zucker',
    category: 'backen',
    quantity: 1,
    unit: 'kg',
    minQuantity: 0.5,
    icon: 'sugar',
    color: '#ffe4e6',
    addedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Spaghetti',
    category: 'getreide',
    quantity: 3,
    unit: 'Packung',
    minQuantity: 2,
    icon: 'pasta',
    color: '#fef9c3',
    addedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Olivenöl',
    category: 'gewuerze',
    quantity: 1,
    unit: 'Flasche',
    minQuantity: 1,
    icon: 'oil',
    color: '#d1fae5',
    addedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Milch',
    category: 'milch',
    quantity: 2,
    unit: 'L',
    minQuantity: 1,
    icon: 'milk',
    color: '#eff6ff',
    addedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Tomaten (Dose)',
    category: 'konserven',
    quantity: 4,
    unit: 'Dose',
    minQuantity: 2,
    icon: 'can',
    color: '#fee2e2',
    addedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Reis',
    category: 'getreide',
    quantity: 1,
    unit: 'kg',
    minQuantity: 0.5,
    icon: 'rice',
    color: '#f0fdf4',
    addedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Salz',
    category: 'gewuerze',
    quantity: 1,
    unit: 'Packung',
    minQuantity: 1,
    icon: 'salt',
    color: '#e0f2fe',
    addedAt: new Date().toISOString(),
  },
];
