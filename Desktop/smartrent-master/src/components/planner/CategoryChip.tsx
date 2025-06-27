
import type { Category } from '@/types/planner';
import { cn } from '@/lib/utils';

interface CategoryChipProps {
  category: Category;
  className?: string;
}

export default function CategoryChip({ category, className }: CategoryChipProps) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-1 text-xs font-semibold rounded-full border leading-none',
        className
      )}
      style={{ backgroundColor: category.color, color: getContrastingTextColor(category.color), borderColor: darkenColor(category.color, 20) }}
      aria-label={`Category: ${category.name}`}
    >
      {category.name}
    </span>
  );
}

// Helper to determine if text should be light or dark based on background color
function getContrastingTextColor(hexColor: string): string {
  if (!hexColor || hexColor.length < 7) return '#000000'; // Default to black for invalid colors
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#222222' : '#FFFFFF'; // Use a darker black for better contrast on light backgrounds
}

// Helper to darken a hex color for border
function darkenColor(hexColor: string, percent: number): string {
    if (!hexColor || hexColor.length < 7) return hexColor;
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    r = Math.max(0, Math.floor(r * (1 - percent / 100)));
    g = Math.max(0, Math.floor(g * (1 - percent / 100)));
    b = Math.max(0, Math.floor(b * (1 - percent / 100)));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
