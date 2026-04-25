import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CommissionCalculator } from "@/components/CommissionCalculator";
import { CommissionTable } from "@/components/CommissionTable";
import { Button } from "@/components/ui/button";
import type { CommissionResult } from "@/lib/commission";

const STEPS = [
  {
    n: "01",
    title: "Te registras gratis",
    body: "Acceso completo a Centro Satori desde el día 1. Sin tarjeta de crédito, sin compromiso, sin suscripción mensual.",
  },
  {
    n: "02",
    title: "Usas los 13 agentes IA",
    body: "Análisis legal, técnico, financiero y estratégico de cada licitación. Zentei antes de licitar.",
  },
  {
    n: "03",
    title: "Ganas el contrato",
    body: "Declaras la adjudicación en tu dashboard con el número de contrato verificable en Mercado Público.",
  },
  {
    n: "04",
    title: "Pagamos juntos el éxito",
    body: "Comisión escalonada según el monto adjudicado. Flow.cl te envía el link de pago por email.",
  },
];

const Landing = () => {
  const [calc, setCalc] = useState<CommissionResult | undefined>();

  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteNav />

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section className="relative grid grid-cols-12 px-6 md:px-12 py-20 md:py-32 min-h-[80vh] items-center overflow-hidden">
        <div className="absolute left-12 top-24 bottom-24 w-px bg-paper/10 hidden md:block" />

        <div className="col-span-12 md:col-start-2 md:col-span-7 z-10 animate-fade-in">
          <div className="inline-block px-3 py-1 thin-border border-violet text-violet-light text-[10px] tracking-[0.25em] uppercase mb-8">
            Compras Públicas · Inteligencia Artificial
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-tighter mb-8 text-balance">
            No pagas para entrar.
            <br />
            <span className="text-violet-light italic">Solo pagas si ganas.</span>
          </h1>
          <p className="max-w-[48ch] text-lg md:text-xl text-paper/70 leading-relaxed mb-12 text-pretty">
            Acceso completo a 13 agentes IA especializados en compras públicas chilenas.
            Sin suscripción mensual. Sin cobro adelantado. Sin riesgo. Solo una comisión
            sobre el contrato que adjudiques.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link to="/registro">Comenzar gratis</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#como-funciona">Cómo funciona</a>
            </Button>
          </div>
          <p className="mt-8 text-xs tracking-widest uppercase text-paper/40">
            Sin tarjeta de crédito · Sin compromiso · Acceso inmediato
          </p>
        </div>

        <div className="hidden md:flex col-start-9 col-span-4 items-center justify-center">
          <div className="relative">
            <span className="font-jp text-[14rem] lg:text-[18rem] leading-none opacity-[0.06] vertical-text select-none">
              悟り
            </span>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="size-44 lg:size-56 rounded-full thin-border border-paper/20 flex items-center justify-center bg-ink/40 backdrop-blur-sm">
                <span className="font-display text-5xl lg:text-7xl tracking-tighter">1∞</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─────────────────────────────────── */}
      <section className="px-6 md:px-12 py-16 md:py-20 thin-border-t border-paper/10 bg-paper/[0.02]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { v: "$2.303M", l: "CLP gestionados en Mercado Público" },
            { v: "100%", l: "Tasa de éxito en proyectos guiados" },
            { v: "#1.931", l: "Entre +50.000 proveedores activos" },
            { v: "13", l: "Agentes IA especializados" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-3xl md:text-4xl tracking-tighter text-paper">
                {s.v}
              </p>
              <p className="mt-3 text-xs text-paper/60 leading-relaxed max-w-[24ch]">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA ────────────────────────────────── */}
      <section id="como-funciona" className="px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 md:col-span-5">
              <span className="label-eyebrow">Cómo funciona</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight">
                Cuatro pasos. Cero fricción.
              </h2>
            </div>
            <div className="col-span-12 md:col-start-7 md:col-span-6 flex items-end">
              <p className="text-paper/60 leading-relaxed text-lg">
                Centro Satori invierte la lógica del SaaS tradicional: nosotros asumimos el
                riesgo, tú accedes a la herramienta. Solo facturamos si ganas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/10 thin-border border-paper/10">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-ink p-8 md:p-10">
                <span className="font-display text-violet-light text-3xl tracking-tighter">
                  {s.n}
                </span>
                <h3 className="mt-6 font-display text-2xl tracking-tight">{s.title}</h3>
                <p className="mt-4 text-sm text-paper/60 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMISIONES ───────────────────────────────────── */}
      <section id="comisiones" className="px-6 md:px-12 py-24 md:py-32 bg-paper/[0.02] thin-border-y border-paper/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 md:col-span-7">
              <span className="label-eyebrow">Estructura de comisiones</span>
              <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight">
                ¿Cuánto pagas si ganas?
                <br />
                <span className="text-violet-light italic">Muy poco. Y solo si ganas.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-start-9 md:col-span-4 flex items-end">
              <p className="text-paper/60 text-sm leading-relaxed">
                Comisión escalonada de <span className="text-paper">0.30% a 0.90%</span> según
                el monto adjudicado. El techo del 0.90% solo aplica a megacontratos donde la
                IA fue pieza clave del proceso.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <CommissionCalculator onCalculated={setCalc} />
          </div>

          <CommissionTable highlightIndex={calc?.bracketIndex} />

          <p className="mt-8 text-xs text-paper/40 tracking-wider">
            * Comisión calculada sobre el monto total adjudicado en CLP. El cobro se genera
            mediante Flow.cl tras la declaración de adjudicación verificable en
            mercadopublico.cl.
          </p>
        </div>
      </section>

      {/* ─── FILOSOFÍA / KANJI ────────────────────────────── */}
      <section className="px-6 md:px-12 py-32 md:py-40">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-jp text-7xl md:text-9xl text-paper/15 mb-12 select-none tracking-[0.5em] ml-[0.5em]">
            悟り
          </p>
          <p className="label-eyebrow">Satori · 悟り · iluminación</p>
          <h2 className="mt-6 font-display text-3xl md:text-5xl tracking-tight leading-tight text-balance">
            "Si tú ganas, nosotros ganamos."
          </h2>
          <p className="mt-8 text-paper/60 max-w-[52ch] mx-auto leading-relaxed">
            Centro Satori nace de Co-Kizuna — el principio del vínculo justo. Un acuerdo
            donde el éxito se comparte porque el riesgo también.
          </p>
        </div>
      </section>

      {/* ─── CTA FINAL ────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 thin-border-t border-paper/10">
        <div className="max-w-5xl mx-auto thin-border border-paper/10 p-10 md:p-16 bg-ink/60 text-center">
          <span className="font-display text-4xl tracking-tighter text-violet-light">1∞</span>
          <h2 className="mt-6 font-display text-3xl md:text-5xl tracking-tight text-balance">
            Comienza gratis hoy.
          </h2>
          <p className="mt-6 text-paper/60 max-w-[44ch] mx-auto">
            Sin tarjeta de crédito. Sin compromiso. Acceso completo desde el día uno.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/registro">Crear cuenta gratis</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Ya tengo cuenta</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default Landing;
