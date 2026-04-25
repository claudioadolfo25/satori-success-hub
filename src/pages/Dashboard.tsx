import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/contexts/AuthContext";
import { apiAdjudications, type Adjudication, type AdjudicationsSummary, ApiError } from "@/lib/api";
import { formatCLP } from "@/lib/commission";
import { CommissionPreview } from "@/components/CommissionCalculator";
import { cn } from "@/lib/utils";

type TabId = "adjudicaciones" | "declarar" | "pagos" | "analisis";

const TABS: { id: TabId; label: string }[] = [
  { id: "adjudicaciones", label: "Mis adjudicaciones" },
  { id: "declarar", label: "Declarar adjudicación" },
  { id: "pagos", label: "Mis pagos" },
  { id: "analisis", label: "Mis licitaciones" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const initial = (params.get("tab") as TabId) ?? "adjudicaciones";
  const [tab, setTab] = useState<TabId>(initial);

  const [adjudications, setAdjudications] = useState<Adjudication[]>([]);
  const [summary, setSummary] = useState<AdjudicationsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiAdjudications.list();
      setAdjudications(res.adjudications);
      setSummary(res.summary);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo cargar tus adjudicaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const switchTab = (next: TabId) => {
    setTab(next);
    setParams({ tab: next });
  };

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteNav />

      {/* Header */}
      <header className="px-6 md:px-12 py-12 md:py-16 thin-border-b border-paper/10">
        <div className="max-w-6xl mx-auto">
          <span className="label-eyebrow">Centro Satori · Panel</span>
          <h1 className="mt-4 font-display text-4xl md:text-5xl tracking-tight">
            Hola, {user?.name?.split(" ")[0] ?? "proveedor"}.
          </h1>
          <p className="mt-3 text-paper/60">
            Aquí gestionas tus adjudicaciones, comisiones y análisis con Centro Satori.
          </p>

          {summary && (
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-paper/10 thin-border border-paper/10">
              <SummaryCell
                label="Contratos adjudicados"
                value={String(summary.totalContracts)}
              />
              <SummaryCell
                label="Total adjudicado"
                value={formatCLP(summary.totalAdjudicated)}
              />
              <SummaryCell
                label="Comisiones"
                value={formatCLP(summary.totalCommissions)}
                accent
              />
              <SummaryCell
                label="Pagos pendientes"
                value={String(summary.pendingPayments)}
              />
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="px-6 md:px-12 thin-border-b border-paper/10 sticky top-[73px] bg-ink/90 backdrop-blur-md z-40">
        <div className="max-w-6xl mx-auto flex gap-2 md:gap-8 overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              className={cn(
                "py-5 text-xs md:text-sm tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors",
                tab === t.id
                  ? "border-violet-light text-paper"
                  : "border-transparent text-paper/50 hover:text-paper",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-8 thin-border border-destructive/40 bg-destructive/10 p-5 text-sm">
              <p className="font-medium mb-1">No se pudo conectar con el servidor</p>
              <p className="text-paper/70">{error}</p>
              <p className="mt-3 text-xs text-paper/50">
                Verifica que <code className="text-violet-light">VITE_API_URL</code> apunta a
                tu backend Express en la Oracle VM y que está accesible.
              </p>
            </div>
          )}

          {tab === "adjudicaciones" && (
            <AdjudicationsTab loading={loading} adjudications={adjudications} />
          )}
          {tab === "declarar" && <DeclareTab onDone={reload} />}
          {tab === "pagos" && <PaymentsTab adjudications={adjudications} />}
          {tab === "analisis" && <AnalysisTab />}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

function SummaryCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-ink p-6">
      <span className="label-eyebrow block mb-3">{label}</span>
      <p
        className={cn(
          "font-display text-2xl md:text-3xl tabular-nums tracking-tighter",
          accent ? "text-violet-light" : "text-paper",
        )}
      >
        {value}
      </p>
    </div>
  );
}

// ─── TAB: Adjudicaciones ──────────────────────────────────

function AdjudicationsTab({
  loading,
  adjudications,
}: {
  loading: boolean;
  adjudications: Adjudication[];
}) {
  if (loading) {
    return <p className="text-paper/50">Cargando adjudicaciones…</p>;
  }
  if (adjudications.length === 0) {
    return (
      <div className="thin-border border-paper/10 p-12 text-center">
        <p className="font-display text-2xl mb-4">Aún no has declarado adjudicaciones.</p>
        <p className="text-paper/60 max-w-[40ch] mx-auto">
          Cuando ganes una licitación con apoyo de Centro Satori, declárala en la pestaña{" "}
          <em>Declarar adjudicación</em> para generar el cobro de comisión.
        </p>
      </div>
    );
  }

  return (
    <div className="thin-border border-paper/10">
      <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-paper/5 label-eyebrow">
        <div className="col-span-4">Contrato</div>
        <div className="col-span-3">Organismo</div>
        <div className="col-span-2 text-right">Monto</div>
        <div className="col-span-2 text-right">Comisión</div>
        <div className="col-span-1 text-right">Estado</div>
      </div>
      {adjudications.map((a) => (
        <div
          key={a.id}
          className="grid grid-cols-1 md:grid-cols-12 px-6 py-6 thin-border-t border-paper/10 gap-3 md:gap-0 md:items-center"
        >
          <div className="md:col-span-4">
            <p className="font-medium">{a.contractName}</p>
            <p className="text-xs text-paper/50 font-mono mt-1">{a.contractNumber}</p>
          </div>
          <div className="md:col-span-3 text-sm text-paper/70">{a.buyerOrg}</div>
          <div className="md:col-span-2 md:text-right tabular-nums">
            {formatCLP(Number(a.contractAmount))}
          </div>
          <div className="md:col-span-2 md:text-right tabular-nums text-violet-light">
            {formatCLP(Number(a.commissionAmount))}
          </div>
          <div className="md:col-span-1 md:text-right">
            <PaymentBadge status={a.paymentStatus} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentBadge({ status }: { status: Adjudication["paymentStatus"] }) {
  const map = {
    pending: { label: "Pendiente", cls: "border-paper/30 text-paper/70" },
    invoiced: { label: "Facturado", cls: "border-amber/50 text-amber" },
    paid: { label: "Pagado", cls: "border-success text-success" },
    disputed: { label: "Disputa", cls: "border-destructive text-destructive" },
  } as const;
  const it = map[status];
  return (
    <span className={cn("inline-block px-2 py-1 thin-border text-[10px] tracking-widest uppercase", it.cls)}>
      {it.label}
    </span>
  );
}

// ─── TAB: Declarar ────────────────────────────────────────

function DeclareTab({ onDone }: { onDone: () => void }) {
  const [amount, setAmount] = useState(0);
  const [contractNumber, setContractNumber] = useState("");
  const [contractName, setContractName] = useState("");
  const [buyerOrg, setBuyerOrg] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [accept, setAccept] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!accept) {
      setError("Debes confirmar que la información es correcta.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiAdjudications.declare({
        contractNumber,
        contractName,
        buyerOrg,
        adjudicatedAt: date,
        contractAmount: amount,
      });
      setSuccess(res.message);
      setAmount(0);
      setContractNumber("");
      setContractName("");
      setBuyerOrg("");
      setAccept(false);
      onDone();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("No se pudo registrar la adjudicación.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <h2 className="font-display text-3xl tracking-tight mb-3">
          Declarar una adjudicación
        </h2>
        <p className="text-paper/60 mb-10 leading-relaxed">
          Registra el contrato que ganaste con apoyo de Centro Satori. Calcularemos la
          comisión según el tramo y Flow.cl te enviará el link de pago por email.
        </p>

        <form onSubmit={handle} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DeclareField
              label="Número de contrato"
              hint="Verificable en mercadopublico.cl"
              value={contractNumber}
              onChange={setContractNumber}
              required
            />
            <DeclareField
              label="Fecha de adjudicación"
              type="date"
              value={date}
              onChange={setDate}
              required
            />
          </div>
          <DeclareField
            label="Nombre de la licitación"
            value={contractName}
            onChange={setContractName}
            required
          />
          <DeclareField
            label="Organismo comprador"
            value={buyerOrg}
            onChange={setBuyerOrg}
            required
          />

          <label className="block">
            <span className="label-eyebrow block mb-3">Monto adjudicado (CLP) *</span>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 font-display text-3xl text-paper/30">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={amount ? amount.toLocaleString("es-CL") : ""}
                onChange={(e) =>
                  setAmount(parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0)
                }
                placeholder="0"
                required
                className="w-full bg-transparent thin-border-b border-paper/20 focus:border-violet-light outline-none pl-8 pb-3 font-display text-3xl tracking-tighter text-paper"
              />
            </div>
          </label>

          {amount > 0 && <CommissionPreview amount={amount} />}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accept}
              onChange={(e) => setAccept(e.target.checked)}
              className="mt-1 size-4 accent-violet"
            />
            <span className="text-sm text-paper/70 leading-relaxed">
              Confirmo que la información es correcta y que el contrato fue adjudicado con
              apoyo de Centro Satori.
            </span>
          </label>

          {error && (
            <div className="thin-border border-destructive/40 bg-destructive/10 p-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="thin-border border-success bg-success/10 p-4 text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-14 px-10 bg-paper text-ink font-medium hover:bg-violet-light transition-colors disabled:opacity-50"
          >
            {submitting ? "Registrando…" : "Confirmar y recibir link de pago"}
          </button>
        </form>
      </div>

      <aside className="lg:col-span-1 thin-border border-paper/10 p-6 h-fit lg:sticky lg:top-32 bg-ink/60">
        <span className="label-eyebrow block mb-4">Cómo se procesa</span>
        <ol className="space-y-5 text-sm text-paper/70">
          <li>
            <span className="font-display text-violet-light text-lg mr-2">01</span>
            Calculamos la comisión según el monto adjudicado y la tabla de tramos.
          </li>
          <li>
            <span className="font-display text-violet-light text-lg mr-2">02</span>
            Flow.cl genera el link de pago y lo envía a tu email registrado.
          </li>
          <li>
            <span className="font-display text-violet-light text-lg mr-2">03</span>
            Pagas con tarjeta, transferencia o Webpay desde el link.
          </li>
          <li>
            <span className="font-display text-violet-light text-lg mr-2">04</span>
            Tu adjudicación queda marcada como pagada en el dashboard.
          </li>
        </ol>
      </aside>
    </div>
  );
}

function DeclareField({
  label,
  value,
  onChange,
  hint,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="label-eyebrow block mb-3">
        {label} {required && <span className="text-violet-light">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-transparent thin-border-b border-paper/20 focus:border-violet-light outline-none py-3 text-lg text-paper transition-colors"
      />
      {hint && <span className="block mt-2 text-xs text-paper/40">{hint}</span>}
    </label>
  );
}

// ─── TAB: Pagos ───────────────────────────────────────────

function PaymentsTab({ adjudications }: { adjudications: Adjudication[] }) {
  const paid = adjudications.filter((a) => a.paymentStatus === "paid");
  const pending = adjudications.filter(
    (a) => a.paymentStatus === "pending" || a.paymentStatus === "invoiced",
  );

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-display text-2xl mb-6">Pagos pendientes</h2>
        {pending.length === 0 ? (
          <p className="text-paper/50">Sin pagos pendientes.</p>
        ) : (
          <PaymentList items={pending} />
        )}
      </div>
      <div>
        <h2 className="font-display text-2xl mb-6">Pagos completados</h2>
        {paid.length === 0 ? (
          <p className="text-paper/50">Aún no hay pagos completados.</p>
        ) : (
          <PaymentList items={paid} />
        )}
      </div>
    </div>
  );
}

function PaymentList({ items }: { items: Adjudication[] }) {
  return (
    <div className="thin-border border-paper/10">
      {items.map((a) => (
        <div
          key={a.id}
          className="grid grid-cols-1 md:grid-cols-12 px-6 py-5 thin-border-t border-paper/10 first:border-t-0 gap-2 md:items-center"
        >
          <div className="md:col-span-6">
            <p className="font-medium">{a.contractName}</p>
            <p className="text-xs text-paper/50 mt-1">
              {new Date(a.adjudicatedAt).toLocaleDateString("es-CL")} · {a.buyerOrg}
            </p>
          </div>
          <div className="md:col-span-3 md:text-right tabular-nums text-violet-light">
            {formatCLP(Number(a.commissionAmount))}
          </div>
          <div className="md:col-span-3 md:text-right">
            <PaymentBadge status={a.paymentStatus} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TAB: Análisis ───────────────────────────────────────

function AnalysisTab() {
  return (
    <div className="thin-border border-paper/10 p-12 text-center">
      <span className="font-jp text-5xl text-paper/15 block mb-6">前提</span>
      <p className="font-display text-2xl mb-4">Análisis con los 13 agentes IA</p>
      <p className="text-paper/60 max-w-[44ch] mx-auto">
        Aquí aparecerán las licitaciones que hayas analizado con Centro Satori. Inicia un
        nuevo análisis desde el agente principal para verlas listadas.
      </p>
    </div>
  );
}

export default Dashboard;
