import React, { useEffect, useRef, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import type { PhoneDialOption } from "../../lib/phoneDialCodes";

/** Static SVG flags served from `public/flags/{ISO2}.svg`. */
function flagPublicSrc(iso2: string): string {
  return `/flags/${encodeURIComponent(iso2)}.svg`;
}

interface Props {
  value: string;
  onChange: (dial: string) => void;
  options: PhoneDialOption[];
  ariaLabel: string;
}

function RegionFlag({ iso2, className }: { iso2: string; className?: string }) {
  return (
    <span
      title={iso2}
      className={`inline-flex shrink-0 overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/10 dark:ring-white/15 ${className ?? ""}`}
    >
      <img
        src={flagPublicSrc(iso2)}
        alt=""
        width={26}
        height={17}
        loading="lazy"
        decoding="async"
        className="block h-[17px] w-[26px] object-cover"
      />
    </span>
  );
}

const PhoneRegionSelect: React.FC<Props> = ({
  value,
  onChange,
  options,
  ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected =
    options.find((o) => o.dial === value) ?? options[0] ?? null;

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!selected) return null;

  const Arrow = open ? HiChevronUp : HiChevronDown;

  return (
    <div ref={rootRef} className="relative min-w-[10.5rem] shrink-0">
      <button
        type="button"
        id="phoneRegion"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className="flex h-full min-h-[3.5rem] w-full items-center gap-2 border border-[1px] border-gainsboro bg-palette-card py-2 pl-2 pr-2 text-left text-sm shadow-md outline-none rounded-lg ring-palette-primary focus-visible:ring-2"
      >
        <RegionFlag iso2={selected.iso2} />
        <span className="min-w-0 flex-1 truncate font-medium tabular-nums">
          {selected.dial}
        </span>
        <Arrow className="h-5 w-5 shrink-0 text-palette-mute" aria-hidden />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-full z-30 mt-1 max-h-56 min-w-full overflow-y-auto rounded-lg border border-gainsboro bg-palette-card py-1 shadow-lg"
        >
          {options.map((opt) => {
            const isActive = opt.dial === value;
            return (
              <li key={`${opt.dial}-${opt.label}`} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`flex w-full items-center gap-2 px-2 py-2 text-left text-sm hover:bg-palette-fill ${
                    isActive ? "bg-palette-fill/80" : ""
                  }`}
                  onClick={() => {
                    onChange(opt.dial);
                    setOpen(false);
                  }}
                >
                  <RegionFlag iso2={opt.iso2} />
                  <span className="tabular-nums font-medium">{opt.dial}</span>
                  <span className="text-palette-mute">({opt.label})</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default PhoneRegionSelect;
