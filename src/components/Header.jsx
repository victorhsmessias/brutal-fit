import { useContext } from "react";
import { WorkoutContext } from "../contexts/WorkoutContext";

export default function Header() {
  const { state } = useContext(WorkoutContext);
  const count = state.exercises.length;

  return (
    <header className="app-header">
      <div className="title-group">
        <h1>Brutal-Fit</h1>
        <span className="tagline">
          Busque exercícios pela base wger e monte seu treino.
        </span>
      </div>
      {count > 0 && (
        <span className="result-badge">
          {count} {count === 1 ? "exercício" : "exercícios"}
        </span>
      )}
    </header>
  );
}
