import type { TouchInput } from "../game/types";

type TouchControlsProps = {
  touch: TouchInput;
  mode: "game" | "overlay" | "hidden";
  onStart: () => void;
  onScores: () => void;
  onConfirm: () => void;
  onMenu: () => void;
  onPause: () => void;
};

function setTouchFlag(touch: TouchInput, key: keyof TouchInput, value: boolean) {
  touch[key] = value;
}

export function TouchControls({
  touch,
  mode,
  onStart,
  onScores,
  onConfirm,
  onMenu,
  onPause,
}: TouchControlsProps) {
  if (mode === "hidden") return null;

  const bind = (key: keyof TouchInput) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setTouchFlag(touch, key, true);
    },
    onPointerUp: () => setTouchFlag(touch, key, false),
    onPointerCancel: () => setTouchFlag(touch, key, false),
    onPointerLeave: (e: React.PointerEvent) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
        setTouchFlag(touch, key, false);
      }
    },
  });

  if (mode === "overlay") {
    return (
      <div className="touch-controls touch-controls-overlay" aria-label="Touch menu controls">
        <button type="button" className="touch-btn touch-btn-primary" onPointerDown={(e) => { e.preventDefault(); onConfirm(); }}>
          OK
        </button>
        <button type="button" className="touch-btn" onPointerDown={(e) => { e.preventDefault(); onStart(); }}>
          START
        </button>
        <button type="button" className="touch-btn" onPointerDown={(e) => { e.preventDefault(); onScores(); }}>
          SCORES
        </button>
      </div>
    );
  }

  return (
    <div className="touch-controls" aria-label="Touch game controls">
      <div className="touch-row touch-move">
        <button type="button" className="touch-btn touch-btn-left" {...bind("moveLeft")}>
          ◀
        </button>
        <button type="button" className="touch-btn touch-btn-right" {...bind("moveRight")}>
          ▶
        </button>
      </div>
      <div className="touch-row touch-actions">
        <button
          type="button"
          className="touch-btn touch-btn-menu"
          onPointerDown={(e) => {
            e.preventDefault();
            onPause();
          }}
        >
          PAUSE
        </button>
        <button
          type="button"
          className="touch-btn touch-btn-menu"
          onPointerDown={(e) => {
            e.preventDefault();
            onMenu();
          }}
        >
          MENU
        </button>
        <button type="button" className="touch-btn touch-btn-fire" {...bind("fire")}>
          FIRE
        </button>
      </div>
    </div>
  );
}
