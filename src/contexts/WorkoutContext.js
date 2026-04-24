import { createContext } from "react";

export const WorkoutContext = createContext(null);

const CATEGORY_PT = {
  Abs: "Abdômen",
  Arms: "Braços",
  Back: "Costas",
  Calves: "Panturrilhas",
  Cardio: "Cardio",
  Chest: "Peito",
  Legs: "Pernas",
  Shoulders: "Ombros",
};

const EQUIPMENT_PT = {
  Barbell: "Barra",
  "SZ-Bar": "Barra W",
  Dumbbell: "Halter",
  "Gym mat": "Colchonete",
  "Swiss Ball": "Bola suíça",
  "Pull-up bar": "Barra fixa",
  "none (bodyweight exercise)": "Peso do corpo",
  Bench: "Banco",
  "Incline bench": "Banco inclinado",
  Kettlebell: "Kettlebell",
  "Table with wheels": "Mesa com rodas",
  "Roll mat": "Tapete",
  "Cable machine": "Máquina de cabos",
  "Foam roll": "Rolo de espuma",
  "Leg press machine": "Leg press",
  "Cable pulldown machine": "Pulley",
  "Smith machine": "Smith",
};

const MUSCLE_PT = {
  "Anterior deltoid": "Deltoide anterior",
  "Biceps brachii": "Bíceps",
  "Biceps femoris": "Posterior de coxa",
  Brachialis: "Braquial",
  "Erector spinae": "Eretores da espinha",
  Gastrocnemius: "Panturrilha (gastrocnêmio)",
  "Gluteus maximus": "Glúteo máximo",
  "Latissimus dorsi": "Grande dorsal",
  "Obliquus externus abdominis": "Oblíquo externo",
  "Pectoralis major": "Peitoral maior",
  "Quadriceps femoris": "Quadríceps",
  "Rectus abdominis": "Reto abdominal",
  "Serratus anterior": "Serrátil anterior",
  Soleus: "Sóleo",
  Trapezius: "Trapézio",
  "Triceps brachii": "Tríceps",
};

export function translateCategory(c) {
  if (!c) return c;
  return { ...c, name: CATEGORY_PT[c.name] || c.name };
}

export function translateEquipment(e) {
  if (!e) return e;
  return { ...e, name: EQUIPMENT_PT[e.name] || e.name };
}

export function translateMuscle(m) {
  if (!m) return m;
  const key = m.name_en || m.name;
  return { ...m, name: MUSCLE_PT[key] || key };
}

export function translateExerciseRefs(ex) {
  return {
    ...ex,
    category: translateCategory(ex.category),
    muscles: (ex.muscles || []).map(translateMuscle),
    equipment: (ex.equipment || []).map(translateEquipment),
  };
}
