/** Dynamic step size based on current quantity and unit */
export function getStep(qty: number, unit: string): number {
  if (unit === 'L' || unit === 'kg') {
    if (qty >= 10)  return 2;
    if (qty >= 5)   return 1;
    if (qty >= 1)   return 0.5;
    if (qty >= 0.2) return 0.1;
    return 0.05;
  }
  if (unit === 'ml' || unit === 'g') {
    if (qty >= 500) return 100;
    if (qty >= 100) return 50;
    return 10;
  }
  // Discrete: Stück, Packung, Dose, etc.
  if (qty >= 20) return 5;
  if (qty >= 10) return 2;
  return 1;
}

/** Smart display: L→ml and kg→g when below 1 */
export function formatQty(qty: number, unit: string): string {
  if (unit === 'L' && qty > 0 && qty < 1) {
    return `${Math.round(qty * 1000)} ml`;
  }
  if (unit === 'kg' && qty > 0 && qty < 1) {
    return `${Math.round(qty * 1000)} g`;
  }
  if ((unit === 'L' || unit === 'kg') && qty >= 1) {
    const r = Math.round(qty * 10) / 10;
    return `${r % 1 === 0 ? r.toFixed(0) : r} ${unit}`;
  }
  return `${qty} ${unit}`;
}

/** Format a delta for the badge (+0.5 L, -100 ml, +2 …) */
export function formatDelta(delta: number, qty: number, unit: string): string {
  const sign = delta > 0 ? '+' : '';
  if (unit === 'L' && qty < 1) {
    return `${sign}${Math.round(delta * 1000)} ml`;
  }
  if (unit === 'kg' && qty < 1) {
    return `${sign}${Math.round(delta * 1000)} g`;
  }
  const r = Math.round(delta * 100) / 100;
  return `${sign}${r % 1 === 0 ? r.toFixed(0) : r}${unit ? ' ' + unit : ''}`;
}
