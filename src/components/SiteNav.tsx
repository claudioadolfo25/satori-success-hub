import { Link, NavLink as RRNavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-6 thin-border-b border-paper/10 sticky top-0 z-50 bg-ink/80 backdrop-blur-md">
      <Link to="/" className="flex items-baseline gap-3 md:gap-4 group">
        <span className="font-display text-2xl tracking-tighter group-hover:text-violet-light transition-colors">
          1∞
        </span>
        <span className="hidden sm:inline text-[10px] tracking-[0.3em] uppercase text-paper/60">
          Co-Kizuna · Centro Satori
        </span>
      </Link>

      <div className="flex items-center gap-6 md:gap-10 text-xs md:text-sm tracking-widest uppercase">
        <NavItem to="/#como-funciona" hash>
          Cómo funciona
        </NavItem>
        <NavItem to="/#comisiones" hash>
          Comisiones
        </NavItem>
        {isAuthenticated ? (
          <>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="hidden md:inline text-paper/60 hover:text-paper transition-colors"
              title={user?.email}
            >
              Salir
            </button>
          </>
        ) : (
          <>
            <NavItem to="/login">Acceder</NavItem>
            <Link
              to="/registro"
              className="px-4 py-2 thin-border border-violet text-violet-light hover:bg-violet hover:text-paper transition-all"
            >
              Comenzar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function NavItem({
  to,
  children,
  hash,
}: {
  to: string;
  children: React.ReactNode;
  hash?: boolean;
}) {
  if (hash) {
    return (
      <a href={to} className="hidden md:inline text-paper/70 hover:text-paper transition-colors">
        {children}
      </a>
    );
  }
  return (
    <RRNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "transition-colors",
          isActive
            ? "text-paper underline underline-offset-8 decoration-violet"
            : "text-paper/70 hover:text-paper",
        )
      }
    >
      {children}
    </RRNavLink>
  );
}
