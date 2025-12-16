/**
 * Formatea minutos a formato legible (ej: "1h 30m" o "45m")
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Formatea fecha a formato local de México
 */
export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/**
 * Formatea fecha solo (sin hora)
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    dateStyle: 'medium',
  });
}

/**
 * Formatea moneda en pesos mexicanos
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
