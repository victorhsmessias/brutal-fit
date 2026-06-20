import { useContext } from "react";
import { useForm } from "react-hook-form";
import { WorkoutContext } from "../contexts/WorkoutContext";
import { API_URL } from "../config";

export default function LoginForm() {
  const { dispatch } = useContext(WorkoutContext);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        const msg = json.error || json.errors?.[0]?.msg || "Erro ao fazer login.";
        setError("root", { message: msg });
        return;
      }

      dispatch({ type: "LOGIN", payload: { token: json.token, user: json.user } });
    } catch {
      setError("root", { message: "Não foi possível conectar ao servidor." });
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h1>Brutal-Fit</h1>
        <p className="login-subtitle">Faça login para acessar</p>

        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email", { required: "E-mail é obrigatório." })}
          />
          {errors.email && (
            <p className="field-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: "Senha é obrigatória." })}
          />
          {errors.password && (
            <p className="field-error" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p className="api-error" role="alert">
            {errors.root.message}
          </p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
