import { useReducer } from "react";
import { WorkoutContext } from "./WorkoutContext";

const initialState = {
  exercises: [],
  selectedExercise: null,
  loading: false,
  error: null,
  token: localStorage.getItem("brutalfit_token") || null,
  user: JSON.parse(localStorage.getItem("brutalfit_user") || "null"),
};

function workoutReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, exercises: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, exercises: [], error: action.payload };
    case "OPEN_DETAILS":
      return { ...state, selectedExercise: action.payload };
    case "CLOSE_DETAILS":
      return { ...state, selectedExercise: null };
    case "LOGIN":
      localStorage.setItem("brutalfit_token", action.payload.token);
      localStorage.setItem("brutalfit_user", JSON.stringify(action.payload.user));
      return { ...state, token: action.payload.token, user: action.payload.user };
    case "LOGOUT":
      localStorage.removeItem("brutalfit_token");
      localStorage.removeItem("brutalfit_user");
      return { ...initialState, token: null, user: null };
    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  return (
    <WorkoutContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
}
