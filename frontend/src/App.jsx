import { useContext, useState } from "react";
import { WorkoutProvider } from "./contexts/WorkoutProvider";
import { WorkoutContext } from "./contexts/WorkoutContext";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import ExerciseList from "./components/ExerciseList";
import ExerciseModal from "./components/ExerciseModal";
import LoginForm from "./components/LoginForm";
import ExerciseForm from "./components/ExerciseForm";

function AppContent() {
  const { state } = useContext(WorkoutContext);
  const [view, setView] = useState("search");

  if (!state.token) {
    return <LoginForm />;
  }

  return (
    <>
      <div className="app">
        <Header />
        <nav className="nav-tabs">
          <button
            type="button"
            className={view === "search" ? "active" : ""}
            onClick={() => setView("search")}
          >
            Buscar Exercícios
          </button>
          <button
            type="button"
            className={view === "insert" ? "active" : ""}
            onClick={() => setView("insert")}
          >
            Inserir Exercício
          </button>
        </nav>

        {view === "search" ? (
          <>
            <SearchForm />
            <ExerciseList />
          </>
        ) : (
          <ExerciseForm onSuccess={() => setView("search")} />
        )}
      </div>
      <ExerciseModal />
    </>
  );
}

function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}

export default App;
