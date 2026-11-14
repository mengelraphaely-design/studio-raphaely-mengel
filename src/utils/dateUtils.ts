/**
 * Utilitários de data e hora seguros para fuso horário local (Brasil / Aracaju)
 * Evita o bug de .toISOString().split('T')[0] que avança 1 dia à noite (UTC-3).
 */

export function toLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function isDateInPast(dateStr: string, referenceDateStr?: string): boolean {
  if (!dateStr) return false;
  const today = referenceDateStr || toLocalDateString();
  return dateStr < today;
}
