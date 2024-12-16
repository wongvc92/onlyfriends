import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Textarea, TextareaProps } from "./textarea";

interface DynamicTextareaProps extends TextareaProps {
  rows?: number;
}

const DynamicTextarea = forwardRef<HTMLTextAreaElement, DynamicTextareaProps>((props, ref) => {
  const { rows = 1, onKeyDown, ...rest } = props; // Destructure onKeyDown to forward it
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // useImperativeHandle(
  //   ref,
  //   () =>
  //     ({
  //       ...(textareaRef.current || {}),
  //       resetHeight: () => {
  //         if (textareaRef.current) {
  //           textareaRef.current.style.height = "auto";
  //           textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  //         }
  //       },
  //     }) as HTMLTextAreaElement & { resetHeight: () => void }
  // );

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
      onKeyDown={onKeyDown}
      style={{ overflow: "hidden" }}
    />
  );
});

DynamicTextarea.displayName = "DynamicTextarea";

export default DynamicTextarea;
