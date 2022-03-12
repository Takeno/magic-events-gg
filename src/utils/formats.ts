export function isFormat(f: string): f is Format {
  return [
    'modern',
    'legacy',
    'standard',
    'pioneer',
    'vintage',
    'commander',
    'centurion',
    'pauper',
    'draft',
    'sealed',
  ].includes(f);
}
