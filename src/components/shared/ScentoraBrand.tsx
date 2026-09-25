export default function ScentoraBrand({ showName = true, compact = false }: { showName?: boolean; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap ${compact ? "gap-2.5" : "gap-2.5 sm:gap-3"}`}>
      <span aria-hidden="true" className={`grid place-items-center rounded-xl bg-accent font-heading font-bold text-textPrimary shadow-sm ring-1 ring-black/5 ${compact ? "h-9 w-9 text-2xl" : "h-9 w-9 text-2xl sm:h-10 sm:w-10 sm:text-3xl"}`}>
        S
      </span>
      {showName ? (
        <span className={`font-heading font-bold uppercase leading-none text-accent ${compact ? "text-sm tracking-[0.24em]" : "text-sm tracking-[0.2em] sm:text-base sm:tracking-[0.26em] md:text-lg"}`}>
          SCENTORA
        </span>
      ) : null}
    </span>
  );
}
