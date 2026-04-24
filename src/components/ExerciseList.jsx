import { useContext } from "react";
import { WorkoutContext } from "../contexts/WorkoutContext";
import ExerciseCard from "./ExerciseCard";

export default function ExerciseList() {
  const { state } = useContext(WorkoutContext);

  if (state.loading) {
    return <p className="loading-state">Carregando exercícios...</p>;
  }

  if (state.exercises.length === 0 && !state.error) {
    return (
      <p className="empty-state">
        Faça uma busca para ver os exercícios aqui.
      </p>
    );
  }

  return (
    <div className="exercise-list">
      {state.exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
