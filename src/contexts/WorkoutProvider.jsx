import { useReducer, useEffect } from "react";
import {
  WorkoutContext,
  translateCategory,
  translateEquipment,
  translateMuscle,
} from "./WorkoutContext";

const initialState = {
  allExercises: [],
  exercises: [],
  categories: [],
  muscles: [],
  equipment: [],
  selectedExercise: null,
  loading: false,
  error: null,
};

function workoutReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_MUSCLES":
      return { ...state, muscles: action.payload };
    case "SET_EQUIPMENT":
      return { ...state, equipment: action.payload };
    case "SET_ALL_EXERCISES":
      return { ...state, allExercises: action.payload };
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, exercises: action.payload };
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        exercises: [],
        error: action.payload,
      };
    case "OPEN_DETAILS":
      return { ...state, selectedExercise: action.payload };
    case "CLOSE_DETAILS":
      return { ...state, selectedExercise: null };
    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [catRes, musRes, eqRes] = await Promise.all([
          fetch("https://wger.de/api/v2/exercisecategory/"),
          fetch("https://wger.de/api/v2/muscle/"),
          fetch("https://wger.de/api/v2/equipment/"),
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          dispatch({
            type: "SET_CATEGORIES",
            payload: catData.results.map(translateCategory),
          });
        }
        if (musRes.ok) {
          const musData = await musRes.json();
          dispatch({
            type: "SET_MUSCLES",
            payload: musData.results.map(translateMuscle),
          });
        }
        if (eqRes.ok) {
          const eqData = await eqRes.json();
          dispatch({
            type: "SET_EQUIPMENT",
            payload: eqData.results.map(translateEquipment),
          });
        }
      } catch {
        // filtros são opcionais
      }
    }
    loadFilters();
  }, []);

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}
