import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthShell, Field } from "@/components/auth/AuthShell";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    await login(String(data.get("email")), String(data.get("password")));
    navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Acceso al Centro Satori"
      subtitle="Ingresa con la cuenta que creaste para continuar tus análisis y declarar adjudicaciones."
      onSubmit={handleSubmit}
      submitLabel="Acceder"
      footer={
        <>
          ¿Aún no tienes cuenta?{" "}
          <a href="/registro" className="text-violet-light hover:underline">
            Crear una gratis
          </a>
        </>
      }
    >
      <Field label="Email" name="email" type="email" required autoComplete="email" />
      <Field
        label="Contraseña"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
    </AuthShell>
  );
};

export default Login;
