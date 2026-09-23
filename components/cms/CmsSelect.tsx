import { useEffect, useRef, useState } from "react";

type CmsSelectOption = { label: string; value: string };

export default function CmsSelect({
  label,
  options,
  value,
  onChange,
  onClear,
  className,
}: {
  label?: string;
  options: CmsSelectOption[];
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];
  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(search.trim().toLowerCase()));

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  function openSearch() {
    setOpen(true);
    requestAnimationFrame(() => searchRef.current?.focus());
  }

  return (
    <div ref={containerRef} className={`relative flex items-start gap-2 ${className ?? ""}`}>
      <div className="relative min-w-0 flex-1">
        {open ? (
          <div className="relative flex min-h-9 w-full items-center rounded-md border border-[#2764d8] bg-white px-3 pt-1 ring-1 ring-[#2764d8]">
            {label ? <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] leading-none text-[#2764d8]">{label}</span> : null}
            <input ref={searchRef} value={search} onChange={(event) => setSearch(event.target.value)} aria-label={label ?? "Search options"} placeholder={selectedOption?.label} className="min-w-0 flex-1 bg-transparent text-sm text-[#12305b] outline-none placeholder:text-[#12305b] placeholder:opacity-100" />
            <span className="ml-auto border-x-[4px] border-x-transparent border-b-[5px] border-b-[#7a8492] rotate-180" aria-hidden="true" />
          </div>
        ) : (
          <button type="button" aria-expanded={open} aria-haspopup="listbox" onClick={() => { setSearch(""); setOpen(true); }} className="relative flex min-h-9 w-full items-center rounded-md border border-[#2764d8] bg-white px-3 pt-1 text-left text-sm text-[#12305b] outline-none transition">
            {label ? <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] leading-none text-[#2764d8]">{label}</span> : null}
            <span className="font-medium">{selectedOption?.label}</span>
            <span className="ml-auto border-x-[4px] border-x-transparent border-b-[5px] border-b-[#7a8492]" aria-hidden="true" />
          </button>
        )}
        {open ? (
          <div className="absolute left-0 top-10 z-30 max-h-56 w-full overflow-y-auto rounded-md border border-[#e0e4eb] bg-white p-2 shadow-[0_3px_10px_rgba(20,35,60,0.12)]" role="listbox" aria-label={label}>
            {filteredOptions.map((option) => {
              const selected = option.value === value;
              return <button type="button" role="option" aria-selected={selected} key={option.value} onClick={() => { onChange(option.value); setSearch(""); setOpen(false); }} className={`block w-full rounded-md px-3 py-2 text-left text-sm text-[#12305b] transition hover:bg-[#e7eefc] ${selected ? "bg-[#e7eefc] font-semibold" : ""}`}>{option.label}</button>;
            })}
            {!filteredOptions.length ? <p className="px-3 py-2 text-sm text-[#7a8492]">No roles found</p> : null}
          </div>
        ) : null}
      </div>
      <button type="button" aria-label="Search roles" onClick={openSearch} className="mt-0.5 flex h-8 w-9 shrink-0 items-center justify-center rounded-md border border-black/15 bg-[#f9a826] text-[#20150f] shadow-sm transition hover:bg-[#e99a18] focus:outline-none focus:ring-2 focus:ring-[#f9a826]/30">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[16px] w-[16px]"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4.2 4.2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></svg>
      </button>
      <button type="button" aria-label="Clear role" onClick={() => { setSearch(""); onClear?.(); }} className="mt-0.5 flex h-8 w-9 shrink-0 items-center justify-center rounded-md border border-black/15 bg-[#faf6ee] text-[#20150f] transition hover:border-[#f9a826] hover:bg-[#f9a826]"><span className="text-lg leading-none">×</span></button>
    </div>
  );
}
