import { useMemo, useState } from "react";
import { calculateCommission, formatCLP } from "@/lib/commission";
import { cn } from "@/lib/utils";

interface Props {
  /** Permite reutilizar la calculadora en el formulario de declaración */
  variant?: "landing" | "inline";
  defaultAmount?: number;
  onCalculated?: (result: ReturnType<typeof calculateCommission>) => void;
}

const PRESETS = [3_000_000, 25_000_000, 150_000_000, 800_000_000, 1_500_000_000];

export function CommissionCalculator({
  variant = "landing",
  defaultAmount = 50_000_000,
  onCalculated,
}: Props) {
  const [amount, setAmount] = useState<number>(defaultAmount);

  const result = useMemo(() => {
    const r = calculateCommission(amount || 0);
    onCalculated?.(r);
    return r;
  }, [amount, onCalculated]);

  const handleChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, "");
    setAmount(cleaned ? parseInt(cleaned, 10) : 0);
  };

  return (
    <div
      className={cn(
        "thin-border border-paper/10 bg-ink/60",
        variant === "landing" ? "p-8 md:p-12" : "p-6",
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <label className="label-eyebrow block mb-4">Monto adjudicado (CLP)</label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 font-display text-3xl text-paper/30">
              $
            </span>
            <input
              type="text"
              inputMode="numeric"
              value={amount ? amount.toLocaleString("es-CL") : ""}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent border-0 thin-border-b border-paper/20 focus:border-violet-light outline-none pl-8 pb-3 font-display text-3xl md:text-5xl tracking-tighter text-paper transition-colors"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(p)}
                className={cn(
                  "px-3 py-1.5 thin-border text-[10px] tracking-widest uppercase transition-all",
                  amount === p
                    ? "border-violet bg-violet/10 text-violet-light"
                    : "border-paper/20 text-paper/60 hover:border-paper/50 hover:text-paper",
                )}
              >
                {p >= 1_000_000_000
                  ? `$${(p / 1_000_000_000).toFixed(p === 1_500_000_000 ? 1 : 0)}B`
                  : `$${p / 1_000_000}M`}
              </button>
            ))}
          </div>
        </div>

        <div className="thin-border-l lg:pl-10 border-paper/10">
          <span className="label-eyebrow block mb-4">Tu comisión Centro Satori</span>
          <p className="font-display text-4xl md:text-6xl tracking-tighter text-violet-light tabular-nums">
            {result.formattedCommission}
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm">
            <span className="font-display text-2xl text-paper">
              {(result.rate * 100).toFixed(2).replace(".", ",")}%
            </span>
            <span className="text-paper/50">tramo {result.bracketLabel}</span>
          </div>
          <p className="mt-8 text-sm text-paper/60 leading-relaxed">
            Solo pagas esta comisión <span className="text-paper">después</span> de adjudicar el
            contrato. Sin costo de entrada, sin suscripción.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Vista compacta — sólo el resultado, sin input. Usada en el formulario de declaración. */
export function CommissionPreview({ amount }: { amount: number }) {
  const result = calculateCommission(amount || 0);
  return (
    <div className="thin-border border-violet/40 bg-violet/5 p-5 grid grid-cols-3 gap-4">
      <div>
        <span className="label-eyebrow block mb-1">Monto contrato</span>
        <p className="font-display text-xl tabular-nums">{formatCLP(amount || 0)}</p>
      </div>
      <div>
        <span className="label-eyebrow block mb-1">Tasa</span>
        <p className="font-display text-xl text-violet-light tabular-nums">
          {(result.rate * 100).toFixed(2).replace(".", ",")}%
        </p>
        <p className="text-[10px] text-paper/50 mt-1">{result.bracketLabel}</p>
      </div>
      <div>
        <span className="label-eyebrow block mb-1">Comisión</span>
        <p className="font-display text-xl text-paper tabular-nums">
          {result.formattedCommission}
        </p>
      </div>
    </div>
  );
}
