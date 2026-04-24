import { useContext, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import DOMPurify from "dompurify";
import { WorkoutContext } from "../contexts/WorkoutContext";

export default function ExerciseModal() {
  const { state, dispatch } = useContext(WorkoutContext);
  const { selectedExercise } = state;

  const close = () => dispatch({ type: "CLOSE_DETAILS" });

  useEffect(() => {
    if (!selectedExercise) return;
    function onKey(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExercise]);

  const { categoryName, muscleNames, equipmentNames, safeDescription } =
    useMemo(() => {
      if (!selectedExercise) return {};
      return {
        categoryName: selectedExercise.category?.name,
        muscleNames: (selectedExercise.muscles || []).map((m) => m.name),
        equipmentNames: (selectedExercise.equipment || []).map((e) => e.name),
        safeDescription: DOMPurify.sanitize(
          selectedExercise.description || "<p>Sem descrição disponível.</p>",
        ),
      };
    }, [selectedExercise]);

  if (!selectedExercise) return null;

  const modal = (
    <div
      className="modal-overlay"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close"
          onClick={close}
          aria-label="Fechar detalhes"
        >
          ×
        </button>
        <h2 id="modal-title">{selectedExercise.name || "Sem nome"}</h2>

        <dl className="modal-meta">
          {categoryName && (
            <>
              <dt>Categoria</dt>
              <dd>{categoryName}</dd>
            </>
          )}
          {muscleNames?.length > 0 && (
            <>
              <dt>Músculos</dt>
              <dd>{muscleNames.join(", ")}</dd>
            </>
          )}
          {equipmentNames?.length > 0 && (
            <>
              <dt>Equipamento</dt>
              <dd>{equipmentNames.join(", ")}</dd>
            </>
          )}
        </dl>

        <div
          className="modal-description"
          dangerouslySetInnerHTML={{ __html: safeDescription }}
        />
      </div>
    </div>
  );

  return createPortal(modal, document.getElementById("modal-root"));
}
