import { useContext } from "react";
import { WorkoutContext } from "../contexts/WorkoutContext";
import { API_URL } from "../config";

export default function Header() {
  const { state, dispatch } = useContext(WorkoutContext);
  const count = state.exercises.length;

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${state.token}` },
      });
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  return (
    <header className="app-header">
      <div className="title-group">
        <h1>Brutal-Fit</h1>
        <span className="tagline">
          Busque e cadastre exercícios no seu treino.
        </span>
      </div>
      <div className="header-right">
        {count > 0 && (
          <span className="result-badge">
            {count} {count === 1 ? "exercício" : "exercícios"}
          </span>
        )}
        {state.user && (
          <span className="user-email">{state.user.email}</span>
        )}
        <button type="button" className="secondary logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}
