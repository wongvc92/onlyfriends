import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateCaretPosition = (textarea: HTMLTextAreaElement, cursorPosition: number) => {
  const clone = document.createElement("div");
  const style = window.getComputedStyle(textarea);

  // Copy textarea styles to the clone
  Array.from(style).forEach((name) => {
    clone.style.setProperty(name, style.getPropertyValue(name));
  });

  clone.style.position = "absolute";
  clone.style.visibility = "hidden";
  clone.style.whiteSpace = "pre-wrap";
  clone.style.overflowWrap = "break-word";
  document.body.appendChild(clone);

  const text = textarea.value.substring(0, cursorPosition);
  clone.textContent = text;

  const span = document.createElement("span");
  span.textContent = textarea.value.substring(cursorPosition) || ".";
  clone.appendChild(span);

  const { offsetTop: top, offsetLeft: left } = span;
  document.body.removeChild(clone);

  return { top, left };
};
