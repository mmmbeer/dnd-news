export const MASONRY_ROW_HEIGHT = 2;

export function masonryRowSpan(height: number, rowHeight = MASONRY_ROW_HEIGHT) {
  if (!Number.isFinite(height) || height <= 0) return 1;
  if (!Number.isFinite(rowHeight) || rowHeight <= 0) return 1;
  return Math.max(1, Math.ceil(height / rowHeight));
}
