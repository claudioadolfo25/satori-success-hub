export function SiteFooter() {
  return (
    <footer className="px-6 md:px-12 py-16 md:py-24 thin-border-t border-paper/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl tracking-tighter">1∞</span>
            <span className="font-jp text-paper/40 text-lg">悟り</span>
          </div>
          <p className="text-sm text-paper/60 leading-relaxed max-w-[36ch]">
            Centro Satori — sistema multiagente IA para proveedores del mercado de
            compras públicas chileno.
          </p>
          <p className="mt-6 text-[10px] tracking-[0.25em] uppercase text-paper/40">
            Zentei antes de licitar
          </p>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[0.25em] uppercase text-paper/40 mb-5">
            Plataforma
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/#como-funciona" className="text-paper/80 hover:text-violet-light transition-colors">
                Cómo funciona
              </a>
            </li>
            <li>
              <a href="/#comisiones" className="text-paper/80 hover:text-violet-light transition-colors">
                Estructura de comisiones
              </a>
            </li>
            <li>
              <a href="/registro" className="text-paper/80 hover:text-violet-light transition-colors">
                Crear cuenta
              </a>
            </li>
            <li>
              <a
                href="https://www.mercadopublico.cl"
                target="_blank"
                rel="noreferrer"
                className="text-paper/80 hover:text-violet-light transition-colors"
              >
                Mercado Público ↗
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] tracking-[0.25em] uppercase text-paper/40 mb-5">
            Clean Lif SpA
          </h4>
          <ul className="space-y-3 text-sm text-paper/80">
            <li>RUT 77.547.366-5</li>
            <li>Co-Kizuna · Centro Satori</li>
            <li>Fundador: Claudio Ayelef · CEO</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 thin-border-t border-paper/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] tracking-[0.2em] uppercase text-paper/40">
        <span>© {new Date().getFullYear()} Clean Lif SpA — Co-Kizuna</span>
        <span>Pagos vía Flow.cl · Verificable en mercadopublico.cl</span>
      </div>
    </footer>
  );
}
