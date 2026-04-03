/**
 * Returns true for units where velocity-based stepping applies:
 * all L/kg quantities and g/ml.
 */
export function isFluid(unit: string): boolean {
  return unit === 'L' || unit === 'kg' || unit === 'ml' || unit === 'g';
}

/**
 * Velocity-based step for L/kg/ml/g.
 * velocity = px/ms of the current drag motion.
 *
 * Under 1 L/kg (shown as ml/g):
 *   slow  → 10 g/ml   medium → 25 g/ml   fast → 50 g/ml
 *
 * 1–5 L/kg:
 *   slow  → 0.1        medium → 0.5        fast → 1
 *
 * 5–10 L/kg:
 *   slow  → 0.5        medium → 1          fast → 2
 *
 * ≥ 10 L/kg:
 *   slow  → 1          medium → 2          fast → 5
 */
export function getVelocityStep(velocity: number, qty: number, unit: string): number {
  const slow   = velocity < 0.4;
  const fast   = velocity > 1.2;

  // g / ml  or  L/kg shown as ml/g (< 1)
  if (unit === 'ml' || unit === 'g' || ((unit === 'L' || unit === 'kg') && qty < 1)) {
    const step = fast ? 50 : slow ? 10 : 25;
    return (unit === 'L' || unit === 'kg') ? step / 1000 : step;
  }

  // L / kg  ≥ 1
  if (qty >= 10) return fast ? 5   : slow ? 1   : 2;
  if (qty >= 5)  return fast ? 2   : slow ? 0.5 : 1;
                 return fast ? 1   : slow ? 0.1 : 0.5;
}

/** Dynamic step size based on current quantity and unit (for +/- buttons) */
export function getStep(qty: number, unit: string): number {
  if (unit === 'L' || unit === 'kg') {
    if (qty >= 10)  return 2;
    if (qty >= 5)   return 1;
    if (qty >= 1)   return 0.5;
    if (qty >= 0.2) return 0.1;
    return 0.01; // 10 g/ml increments for buttons too
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

export { isSmallFluid };

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
