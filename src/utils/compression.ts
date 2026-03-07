import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

export function compressText(text: string): string {
  if (!text) return '';
  return compressToEncodedURIComponent(text);
}

export function decompressText(compressed: string): string {
  if (!compressed) return '';
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return decompressFromEncodedURIComponent(compressed) ?? '';
}
