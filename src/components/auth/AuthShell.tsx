import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { ApiError } from "@/lib/api";

interface Props {
  title: string;
  subtitle: string;
  footer: ReactNode;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitLabel: string;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, footer, onSubmit, submitLabel, children }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(e);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-paper flex flex-col">
      <SiteNav />

      <main className="flex-1 grid grid-cols-12 px-6 md:px-12 py-16 md:py-24">
        <div className="col-span-12 md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6">
          <Link to="/" className="font-display text-3xl tracking-tighter text-violet-light hover:text-paper transition-colors">
            1∞
          </Link>
          <h1 className="mt-8 font-display text-4xl md:text-5xl tracking-tight">{title}</h1>
          <p className="mt-4 text-paper/60 leading-relaxed">{subtitle}</p>

          <form onSubmit={handle} className="mt-12 space-y-6">
            {children}

            {error && (
              <div className="thin-border border-destructive/40 bg-destructive/10 p-4 text-sm text-paper">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-paper text-ink font-medium tracking-tight hover:bg-violet-light transition-colors disabled:opacity-50"
            >
              {loading ? "Procesando…" : submitLabel}
            </button>

            <div className="text-sm text-paper/60 text-center">{footer}</div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  hint?: string;
  defaultValue?: string;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export function Field({
  label,
  name,
  type = "text",
  required,
  hint,
  defaultValue,
  autoComplete,
  onChange,
  value,
}: FieldProps) {
  return (
    <label className="block">
      <span className="label-eyebrow block mb-3">
        {label} {required && <span className="text-violet-light">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        onChange={onChange}
        value={value}
        className="w-full bg-transparent thin-border-b border-paper/20 focus:border-violet-light outline-none py-3 text-lg text-paper transition-colors"
      />
      {hint && <span className="block mt-2 text-xs text-paper/40">{hint}</span>}
    </label>
  );
}
