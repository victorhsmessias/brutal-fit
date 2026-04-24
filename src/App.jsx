import { WorkoutProvider } from "./contexts/WorkoutProvider";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import ExerciseList from "./components/ExerciseList";
import ExerciseModal from "./components/ExerciseModal";

function App() {
  return (
    <WorkoutProvider>
      <div className="app">
        <Header />
        <SearchForm />
        <ExerciseList />
      </div>
      <ExerciseModal />
    </WorkoutProvider>
  );
}

export default App;
