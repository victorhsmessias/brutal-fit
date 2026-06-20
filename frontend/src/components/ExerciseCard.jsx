import { useContext } from "react";
import DOMPurify from "dompurify";
import { WorkoutContext } from "../contexts/WorkoutContext";

export default function ExerciseCard({ exercise }) {
  const { dispatch } = useContext(WorkoutContext);
  const safeDescription = DOMPurify.sanitize(
    exercise.description || "<p>Sem descrição disponível.</p>",
  );

  const openDetails = () => {
    dispatch({ type: "OPEN_DETAILS", payload: exercise });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetails();
    }
  };

  return (
    <article
      className="exercise-card"
      role="button"
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={onKeyDown}
      aria-label={`Ver detalhes de ${exercise.name || "exercício"}`}
    >
      <h3>{exercise.name || "Sem nome"}</h3>
      <div
        className="description"
        dangerouslySetInnerHTML={{ __html: safeDescription }}
      />
      <span className="details-hint">Clique para ver detalhes →</span>
    </article>
  );
}
