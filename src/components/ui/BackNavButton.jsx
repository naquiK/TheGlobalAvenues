import { ArrowLeft } from 'lucide-react';

export default function BackNavButton({
  label,
  onClick,
  className = '',
  type = 'button',
}) {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/25 bg-gradient-to-r from-primary/12 via-background/80 to-secondary/12 px-3.5 py-2 text-sm font-semibold text-foreground shadow-[0_8px_20px_rgba(20,14,45,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-[0_12px_24px_rgba(20,14,45,0.18)] dark:border-white/15 dark:from-white/[0.06] dark:via-[#120D24]/80 dark:to-white/[0.06] dark:hover:border-white/30 sm:w-auto sm:px-4 sm:py-1.5 sm:text-[15px] ${className}`.trim()}
      type={type}
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primary/20 dark:border-white/20 dark:bg-white/10 dark:text-white">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </span>
      <span className="tracking-[0.01em]">{label}</span>
    </button>
  );
}
