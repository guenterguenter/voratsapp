/**
 * Returns true when the quantity/unit combo is in "small" territory
 * where velocity-based stepping applies (under 1 L/kg → shown as ml/g)
 */
function isSmallFluid(qty: number, unit: string): boolean {
  if (unit === 'ml' || unit === 'g') return true;
  if ((unit === 'L' || unit === 'kg') && qty < 1) return true;
  return false;
}

/**
 * Velocity-based step for small fluid quantities (g / ml).
 * velocity = px/ms of the current drag motion.
 *   slow  (< 0.4 px/ms)  →  10 g/ml
 *   medium(0.4–1.2 px/ms) → 25 g/ml
 *   fast  (> 1.2 px/ms)   → 50 g/ml
 * For L/kg these map back to 0.01 / 0.025 / 0.05
 */
export function getVelocityStep(velocity: number, unit: string): number {
  let step: number;
  if (velocity > 1.2)      step = 50;
  else if (velocity > 0.4) step = 25;
  else                     step = 10;

  // convert back to L/kg if needed
  if (unit === 'L' || unit === 'kg') return step / 1000;
  return step;
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
