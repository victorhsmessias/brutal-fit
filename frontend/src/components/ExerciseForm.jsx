import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { WorkoutContext } from "../contexts/WorkoutContext";
import { CATEGORIES, MUSCLES, EQUIPMENT } from "../contexts/WorkoutContext";
import { API_URL } from "../config";

export default function ExerciseForm({ onSuccess }) {
  const { state, dispatch } = useContext(WorkoutContext);
  const [successMsg, setSuccessMsg] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", description: "", category: "", muscles: [], equipment: [] },
  });

  const onSubmit = async (data) => {
    setSuccessMsg("");
    try {
      const res = await fetch(`${API_URL}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          category: data.category,
          muscles: Array.isArray(data.muscles) ? data.muscles : [data.muscles].filter(Boolean),
          equipment: Array.isArray(data.equipment) ? data.equipment : [data.equipment].filter(Boolean),
        }),
      });

      if (res.status === 401) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      const json = await res.json();

      if (!res.ok) {
        const msg = json.error || json.errors?.[0]?.msg || "Erro ao inserir exercício.";
        setError("root", { message: msg });
        return;
      }

      setSuccessMsg(`Exercício "${json.name}" inserido com sucesso!`);
      reset();
    } catch {
      setError("root", { message: "Não foi possível conectar ao servidor." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="exercise-form">
      <h2>Inserir Exercício</h2>

      <div className="form-group">
        <label htmlFor="ex-name">Nome *</label>
        <input
          id="ex-name"
          type="text"
          placeholder="Ex.: Agachamento livre"
          {...register("name", { required: "Nome é obrigatório." })}
        />
        {errors.name && (
          <p className="field-error" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="ex-desc">Descrição</label>
        <textarea
          id="ex-desc"
          rows={4}
          placeholder="Descreva a execução do exercício..."
          {...register("description")}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ex-category">Categoria</label>
          <select id="ex-category" {...register("category")}>
            <option value="">Selecione...</option>
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="ex-muscles">
            Músculos <span className="hint">(Ctrl para selecionar vários)</span>
          </label>
          <select id="ex-muscles" multiple size={6} {...register("muscles")}>
            {MUSCLES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="ex-equipment">
            Equipamento <span className="hint">(Ctrl para selecionar vários)</span>
          </label>
          <select id="ex-equipment" multiple size={6} {...register("equipment")}>
            {EQUIPMENT.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errors.root && (
        <p className="api-error" role="alert">
          {errors.root.message}
        </p>
      )}

      {successMsg && (
        <p className="success-msg" role="status">
          {successMsg}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Exercício"}
        </button>
        {successMsg && (
          <button type="button" className="secondary" onClick={onSuccess}>
            Ver lista de exercícios →
          </button>
        )}
      </div>
    </form>
  );
}
