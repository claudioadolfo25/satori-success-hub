import { Link, useSearchParams } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const PaymentResult = () => {
  const [params] = useSearchParams();
  const order = params.get("orden");

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col">
      <SiteNav />

      <main className="flex-1 px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-2xl mx-auto thin-border border-paper/10 p-10 md:p-16 bg-ink/60 text-center">
          <span className="font-display text-5xl tracking-tighter text-violet-light">1∞</span>
          <h1 className="mt-8 font-display text-3xl md:text-4xl tracking-tight">
            Estamos confirmando tu pago.
          </h1>
          <p className="mt-6 text-paper/60 leading-relaxed">
            Flow.cl notificará a Centro Satori cuando el pago esté procesado.
            En unos segundos verás el estado actualizado en tu dashboard.
          </p>
          {order && (
            <p className="mt-8 thin-border border-paper/20 inline-block px-4 py-2 text-xs tracking-widest uppercase text-paper/70 font-mono">
              Orden: {order}
            </p>
          )}
          <div className="mt-12 flex justify-center gap-4">
            <Link
              to="/dashboard?tab=pagos"
              className="px-8 h-12 inline-flex items-center bg-paper text-ink hover:bg-violet-light transition-colors"
            >
              Ver mis pagos
            </Link>
            <Link
              to="/dashboard"
              className="px-8 h-12 inline-flex items-center thin-border border-paper/30 hover:border-paper transition-colors"
            >
              Ir al dashboard
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default PaymentResult;
