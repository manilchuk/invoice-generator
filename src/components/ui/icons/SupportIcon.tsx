interface SupportIconProps {
  size?: number;
  className?: string;
}

export function SupportIcon({ size = 20, className }: SupportIconProps) {
  return (
    <svg width={size} height={size} className={className} aria-hidden="true" fill="currentColor">
      <use href="/sprite.svg#icon-bubbles3" />
    </svg>
  );
}
