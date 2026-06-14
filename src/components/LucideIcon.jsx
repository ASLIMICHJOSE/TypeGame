// Dynamic Lucide icon renderer
import * as LucideIcons from 'lucide-react';

/**
 * Renders a Lucide icon by name string.
 * @param {{ name: string, size?: number, color?: string, strokeWidth?: number, className?: string }} props
 */
export default function LucideIcon({ name, size = 24, color, strokeWidth = 1.75, className = '' }) {
  const IconComponent = LucideIcons[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}
