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

export const CATEGORIES = Object.values(CATEGORY_PT).sort();
export const MUSCLES = Object.values(MUSCLE_PT).sort();
export const EQUIPMENT = Object.values(EQUIPMENT_PT).sort();
