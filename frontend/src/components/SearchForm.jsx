import { useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { WorkoutContext } from "../contexts/WorkoutContext";
import { API_URL } from "../config";
import Filters from "./Filters";

export default function SearchForm() {
  const methods = useForm({
    defaultValues: { searchTerm: "", category: "", muscle: "", equipment: "" },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const { state, dispatch } = useContext(WorkoutContext);

  const onSubmit = async (data) => {
    dispatch({ type: "FETCH_START" });
    try {
      const params = new URLSearchParams({
        search: data.searchTerm.trim(),
        category: data.category || "",
        muscle: data.muscle || "",
        equipment: data.equipment || "",
      });

      const res = await fetch(`${API_URL}/exercises?${params}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      if (res.status === 401) {
        dispatch({ type: "LOGOUT" });
        return;
      }

      if (!res.ok) {
        throw new Error("Falha na comunicação com o servidor.");
      }

      const exercises = await res.json();

      if (exercises.length === 0) {
        dispatch({
          type: "FETCH_ERROR",
          payload: "Nenhum exercício encontrado. Ajuste os filtros ou tente outro termo.",
        });
      } else {
        dispatch({ type: "FETCH_SUCCESS", payload: exercises });
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  const handleReset = () => {
    reset();
    dispatch({ type: "FETCH_SUCCESS", payload: [] });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="search-form">
        <h2>Buscar Exercícios</h2>

        <div className="fields">
          <input
            type="text"
            placeholder="Nome do exercício (ou deixe vazio para ver todos)"
            {...register("searchTerm")}
          />
          <button type="submit" disabled={state.loading}>
            {state.loading ? "Buscando..." : "Buscar"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={handleReset}
            disabled={state.loading}
          >
            Limpar
          </button>
        </div>

        <Filters />

        {errors.searchTerm && (
          <p className="error" role="alert">
            {errors.searchTerm.message}
          </p>
        )}
        {state.error && (
          <p className="api-error" role="alert">
            {state.error}
          </p>
        )}
      </form>
    </FormProvider>
  );
}
