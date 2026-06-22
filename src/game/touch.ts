import type { TouchInput } from "./types";

export function createTouchInput(): TouchInput {
  return { moveLeft: false, moveRight: false, fire: false };
}

export function isTouchActive(touch: TouchInput): boolean {
  return touch.moveLeft || touch.moveRight || touch.fire;
}
