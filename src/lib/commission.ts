/**
 * Cálculo de comisión escalonada — Centro Satori.
 * Replica exactamente la lógica del servidor (server/utils/commission.ts)
 * para poder mostrar la calculadora pública sin depender del backend.
 */

export interface CommissionBracket {
  maxAmount: number;
  rate: number;
  label: string;
  example: number; // monto representativo del tramo (para la tabla)
}

export const BRACKETS: CommissionBracket[] = [
  { maxAmount: 3_000_000, rate: 0.003, label: "Hasta $3M", example: 3_000_000 },
  { maxAmount: 10_000_000, rate: 0.004, label: "$5M – $10M", example: 10_000_000 },
  { maxAmount: 50_000_000, rate: 0.005, label: "$20M – $50M", example: 50_000_000 },
  { maxAmount: 300_000_000, rate: 0.0065, label: "$100M – $300M", example: 300_000_000 },
  { maxAmount: 1_000_000_000, rate: 0.008, label: "$500M – $1.000M", example: 1_000_000_000 },
  { maxAmount: 1_500_000_000, rate: 0.009, label: "$1.250M – $1.500M", example: 1_500_000_000 },
];

export interface CommissionResult {
  rate: number;
  commissionCLP: number;
  bracketLabel: string;
  bracketIndex: number;
  formattedCommission: string;
  formattedAmount: string;
}

const fmtCLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  minimumFractionDigits: 0,
});

export function formatCLP(amount: number): string {
  return fmtCLP.format(amount);
}

export function calculateCommission(contractAmountCLP: number): CommissionResult {
  const bracketIndex = BRACKETS.findIndex((b) => contractAmountCLP <= b.maxAmount);
  const finalIndex = bracketIndex === -1 ? BRACKETS.length - 1 : bracketIndex;
  const bracket = BRACKETS[finalIndex];
  const commissionCLP = Math.round(contractAmountCLP * bracket.rate);

  return {
    rate: bracket.rate,
    commissionCLP,
    bracketLabel: bracket.label,
    bracketIndex: finalIndex,
    formattedCommission: fmtCLP.format(commissionCLP),
    formattedAmount: fmtCLP.format(contractAmountCLP),
  };
}
