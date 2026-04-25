import { BRACKETS, formatCLP } from "@/lib/commission";
import { cn } from "@/lib/utils";

interface Props {
  highlightIndex?: number;
}

export function CommissionTable({ highlightIndex }: Props) {
  return (
    <div className="thin-border border-paper/10 bg-ink/60">
      <div className="grid grid-cols-12 px-6 md:px-8 py-4 bg-paper/5 label-eyebrow">
        <div className="col-span-1 hidden md:block">#</div>
        <div className="col-span-6 md:col-span-5">Tramo (CLP)</div>
        <div className="col-span-3">Comisión</div>
        <div className="col-span-3 text-right">Comisión ejemplo</div>
      </div>

      {BRACKETS.map((b, idx) => {
        const isActive = highlightIndex === idx;
        const exampleCommission = Math.round(b.example * b.rate);
        return (
          <div
            key={b.label}
            className={cn(
              "grid grid-cols-12 px-6 md:px-8 py-6 thin-border-t border-paper/10 transition-colors items-center",
              isActive ? "bg-violet/15" : "hover:bg-paper/[0.02]",
            )}
          >
            <div className="col-span-1 hidden md:block tabular-nums text-paper/30 text-xs font-mono">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="col-span-6 md:col-span-5 text-base md:text-lg">{b.label}</div>
            <div
              className={cn(
                "col-span-3 font-display text-xl md:text-2xl tabular-nums transition-colors",
                isActive ? "text-violet-light" : "text-paper",
              )}
            >
              {(b.rate * 100).toFixed(2).replace(".", ",")}%
            </div>
            <div className="col-span-3 text-right text-paper/60 tabular-nums text-sm md:text-base">
              {formatCLP(exampleCommission)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
