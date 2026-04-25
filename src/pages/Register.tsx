import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthShell, Field } from "@/components/auth/AuthShell";
import { formatRut, isValidRut } from "@/lib/rut";

const REGIONES = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [rut, setRut] = useState("");
  const [rutError, setRutError] = useState<string | null>(null);

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRut(e.target.value);
    setRut(formatted);
    if (formatted && !isValidRut(formatted)) {
      setRutError("RUT inválido");
    } else {
      setRutError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (rut && !isValidRut(rut)) {
      throw new Error("RUT inválido. Verifica los dígitos y el dígito verificador.");
    }

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const password = String(data.get("password"));
    if (password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }

    await register({
      name: String(data.get("name")),
      email: String(data.get("email")),
      password,
      rut: rut || undefined,
      empresa: String(data.get("empresa") ?? "") || undefined,
      region: String(data.get("region") ?? "") || undefined,
      phone: String(data.get("phone") ?? "") || undefined,
    });
    navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Crea tu acceso a Centro Satori"
      subtitle="Acceso completo, gratuito y sin tarjeta de crédito. Solo pagas si ganas una licitación con apoyo del sistema."
      onSubmit={handleSubmit}
      submitLabel="Crear cuenta y comenzar"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-violet-light hover:underline">
            Acceder
          </a>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Nombre completo" name="name" required autoComplete="name" />
        <Field
          label="RUT"
          name="rut_display"
          value={rut}
          onChange={handleRutChange}
          hint={rutError ?? "Ej: 12.345.678-9"}
        />
      </div>

      <Field label="Email" name="email" type="email" required autoComplete="email" />

      <Field
        label="Contraseña"
        name="password"
        type="password"
        required
        autoComplete="new-password"
        hint="Mínimo 8 caracteres"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Empresa" name="empresa" autoComplete="organization" />
        <Field label="Teléfono" name="phone" type="tel" autoComplete="tel" />
      </div>

      <label className="block">
        <span className="label-eyebrow block mb-3">Región</span>
        <select
          name="region"
          className="w-full bg-transparent thin-border-b border-paper/20 focus:border-violet-light outline-none py-3 text-lg text-paper appearance-none cursor-pointer"
        >
          <option value="" className="bg-ink">
            Selecciona…
          </option>
          {REGIONES.map((r) => (
            <option key={r} value={r} className="bg-ink">
              {r}
            </option>
          ))}
        </select>
      </label>

      <p className="text-xs text-paper/50 leading-relaxed">
        Al crear tu cuenta aceptas el modelo de éxito compartido: acceso gratuito a Centro
        Satori, comisión escalonada solo sobre contratos adjudicados con apoyo del sistema.
      </p>
    </AuthShell>
  );
};

export default Register;
