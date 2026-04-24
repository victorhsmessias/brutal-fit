import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { WorkoutContext } from "../contexts/WorkoutContext";

export default function Filters() {
  const { register } = useFormContext();
  const { state } = useContext(WorkoutContext);

  return (
    <div className="filters">
      <select {...register("category")} aria-label="Categoria do exercício">
        <option value="">Todas as categorias</option>
        {state.categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select {...register("muscle")} aria-label="Músculo trabalhado">
        <option value="">Todos os músculos</option>
        {state.muscles.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <select {...register("equipment")} aria-label="Equipamento">
        <option value="">Todos os equipamentos</option>
        {state.equipment.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
    </div>
  );
}
