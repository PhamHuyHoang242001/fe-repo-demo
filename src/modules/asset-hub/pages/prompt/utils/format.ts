// Small shared formatters for the prompt UI. Kept dependency-free (no date-fns import here
// to stay within the isolated module's light footprint).

/** Human-readable byte size, e.g. 2411724 → "2.3 MB". Null-safe → "" when size unknown. */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || bytes < 0) return '';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.max(0, Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/** Short vi-VN date, e.g. "05/06/2026". Falls back to the ISO date slice on error. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}
