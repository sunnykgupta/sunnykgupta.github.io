import type { ReactNode } from "react";

export function PixelBar({
  value,
  max,
  color = "#ffc94a",
  height = 10,
  className = "",
}: {
  value: number;
  max: number;
  color?: string;
  height?: number;
  className?: string;
}) {
  const segments = Math.max(1, max);
  return (
    <div
      className={`flex gap-[3px] border-[3px] border-[#0b0817] bg-[#191233] p-[3px] ${className}`}
      style={{ height: height + 12 }}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="flex-1 transition-colors duration-150"
          style={{ background: i < value ? color : "#2b2350" }}
        />
      ))}
    </div>
  );
}

export function ProgressStrip({
  percent,
  color = "#ffc94a",
}: {
  percent: number;
  color?: string;
}) {
  return (
    <div className="h-3 w-full border-[3px] border-[#0b0817] bg-[#191233]">
      <div
        className="h-full transition-all duration-300"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  );
}

export function PixelButton({
  children,
  onClick,
  active,
  className = "",
  disabled,
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  href?: string;
}) {
  const classes = `pixel-btn ${active ? "pixel-btn-active" : ""} px-4 py-3 text-[14px] leading-relaxed uppercase disabled:opacity-40 ${className}`;
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={`${classes} inline-block text-center no-underline`}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}

export function Panel({
  title,
  children,
  onClose,
  footer,
  wide,
}: {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#0b0817]/85 p-4 py-10 sm:items-center">
      <div
        className={`pixel-frame anim-pop w-full ${wide ? "max-w-4xl" : "max-w-2xl"} p-5 sm:p-7`}
      >
        <div className="mb-5 flex items-center justify-between gap-4 border-b-[3px] border-[#35275f] pb-3">
          <h2 className="text-gold text-[17px] sm:text-[20px]">{title}</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-muted hover:text-coral text-[13px]"
            >
              [ESC] X
            </button>
          )}
        </div>
        {children}
        {footer && <div className="mt-6 border-t-[3px] border-[#35275f] pt-4">{footer}</div>}
      </div>
    </div>
  );
}

export function Star() {
  return (
    <span className="text-lime anim-star pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-[14px]">
      ★
    </span>
  );
}
