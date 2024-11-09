import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Textarea } from "./textarea";

interface DynamicTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}

const DynamicTextarea = forwardRef<HTMLTextAreaElement, DynamicTextareaProps>((props, ref) => {
  const { rows, ...rest } = props;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto"; // Reset height
    target.style.height = `${target.scrollHeight}px`; // Set to scroll height
  };

  return (
    <Textarea
      {...rest}
      rows={rows}
      ref={(el) => {
        textareaRef.current = el;
        if (el) {
          el.style.height = "auto"; // Reset height on mount
          el.style.height = `${el.scrollHeight}px`; // Set to scroll height on mount
        }
      }}
      onInput={handleInput}
      style={{ overflow: "hidden" }}
    />
  );
});

DynamicTextarea.displayName = "DynamicTextarea";

export default DynamicTextarea;
