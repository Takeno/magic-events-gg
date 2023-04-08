const formats = [
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
] as const;

export default formats;

export type Format = typeof formats[number];

export function isFormat(f: any): f is Format {
  return formats.includes(f);
}
