import { useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  WorkoutContext,
  translateExerciseRefs,
} from "../contexts/WorkoutContext";
import Filters from "./Filters";

const PT_LANG = 7;
const EN_LANG = 2;

function pickTranslation(translations = []) {
  return (
    translations.find((t) => t.language === PT_LANG && t.name) ||
    translations.find((t) => t.language === EN_LANG && t.name) ||
    translations.find((t) => t.name)
  );
}

export default function SearchForm() {
  const methods = useForm({
    defaultValues: {
      searchTerm: "",
      category: "",
      muscle: "",
      equipment: "",
    },
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
      let all = state.allExercises;
      if (all.length === 0) {
        const res = await fetch(
          "https://wger.de/api/v2/exerciseinfo/?limit=1000",
        );
        if (!res.ok) {
          throw new Error("Falha na comunicação com a API wger.");
        }
        const json = await res.json();
        all = json.results;
        dispatch({ type: "SET_ALL_EXERCISES", payload: all });
      }

      const term = data.searchTerm.trim().toLowerCase();
      const categoryId = data.category ? Number(data.category) : null;
      const muscleId = data.muscle ? Number(data.muscle) : null;
      const equipmentId = data.equipment ? Number(data.equipment) : null;

      const filtered = all
        .map((ex) => {
          const tr = pickTranslation(ex.translations);
          if (!tr) return null;
          const matchesTerm = (ex.translations || []).some(
            (t) => t.name && t.name.toLowerCase().includes(term),
          );
          if (!matchesTerm) return null;
          const translated = translateExerciseRefs(ex);
          return {
            id: ex.id,
            name: tr.name,
            description: tr.description,
            language: tr.language,
            category: translated.category,
            muscles: translated.muscles,
            equipment: translated.equipment,
            images: ex.images,
          };
        })
        .filter((ex) => {
          if (!ex) return false;
          if (categoryId && ex.category?.id !== categoryId) return false;
          if (
            muscleId &&
            !(ex.muscles || []).some((m) => m.id === muscleId)
          ) {
            return false;
          }
          if (
            equipmentId &&
            !(ex.equipment || []).some((e) => e.id === equipmentId)
          ) {
            return false;
          }
          return true;
        });

      if (filtered.length === 0) {
        dispatch({
          type: "FETCH_ERROR",
          payload:
            "Nenhum exercício encontrado. Ajuste os filtros ou tente outro termo.",
        });
      } else {
        dispatch({ type: "FETCH_SUCCESS", payload: filtered });
      }
    } catch (error) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="search-form">
        <h2>Buscar Exercícios</h2>

        <div className="fields">
          <input
            type="text"
            placeholder="Ex.: Squat, Agachamento, Press, Curl..."
            {...register("searchTerm", {
              required: "O campo de busca não pode ficar vazio.",
              minLength: { value: 3, message: "Digite pelo menos 3 letras." },
            })}
          />
          <button type="submit" disabled={state.loading}>
            {state.loading ? "Buscando..." : "Buscar"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => reset()}
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
