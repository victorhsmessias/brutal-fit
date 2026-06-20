import { useFormContext } from "react-hook-form";
import { CATEGORIES, MUSCLES, EQUIPMENT } from "../contexts/WorkoutContext";

export default function Filters() {
  const { register } = useFormContext();

  return (
    <div className="filters">
      <select {...register("category")} aria-label="Categoria do exercício">
        <option value="">Todas as categorias</option>
        {CATEGORIES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <select {...register("muscle")} aria-label="Músculo trabalhado">
        <option value="">Todos os músculos</option>
        {MUSCLES.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <select {...register("equipment")} aria-label="Equipamento">
        <option value="">Todos os equipamentos</option>
        {EQUIPMENT.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
