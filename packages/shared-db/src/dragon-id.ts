/**
 * Dragon ID Generator & Validator Utility for Dragon Gaming Studios Monorepo
 */

export function generateDragonId(): string {
  const part1 = Math.floor(1000 + Math.random() * 9000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let part2 = '';
  for (let i = 0; i < 4; i++) {
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DRAGON-${part1}-${part2}`;
}

export function formatDragonId(input: string): string {
  const clean = input.toUpperCase().trim();
  if (clean.startsWith('DRAGON-')) return clean;
  if (/^\d{4}-[A-Z0-9]{4}$/.test(clean)) return `DRAGON-${clean}`;
  return clean;
}

export function isValidDragonId(id: string): boolean {
  return /^DRAGON-\d{4}-[A-Z0-9]{4}$/.test(id.toUpperCase().trim());
}
