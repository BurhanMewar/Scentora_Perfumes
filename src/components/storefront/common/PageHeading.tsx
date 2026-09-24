
interface HeadingProps {
  text: string;
  count?: number;
  subtitle?: string;
  Filter?: React.ReactNode;
  className?: string;
  bottomBorderNeeded?: boolean;
  fontSize?: string;
  subtitleSize?: string;
}
export function Heading({
  text,
  count,
  subtitle,
  Filter,
  className = "max-w-3xl",
  bottomBorderNeeded = true,
  fontSize = "text-2xl md:text-3xl",
  subtitleSize = "text-sm md:text-base",
}: HeadingProps) {
  return (
    <>
      <div className={`mb-4 flex flex-col gap-1 ${className}`}>
        <div className="flex gap-1 flex-wrap items-end">
          <h1
            className={`${fontSize} uppercase font-heading font-semibold leading-tight tracking-wide`}
          >
            {text}
          </h1>
          {count !== undefined ? <span className="mb-1 rounded-full bg-accent/15 px-2 py-0.5 text-xs font-semibold text-textSecondary">{count}</span> : null}
        </div>

        {subtitle && (
          <p className={`font-body font-medium text-textSecondary ${subtitleSize}`}>
            {subtitle}
          </p>
        )}
      </div>

      {Filter && <div className="mt-3 mb-4">{Filter}</div>}
      {bottomBorderNeeded && <hr className="mb-6 border-black/10" />}
    </>
  );
}
