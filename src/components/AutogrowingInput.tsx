import { useEffect, useRef, useState } from "react";

import "../styles/AutogrowingInput.css";

type AutogrowingInputProps = {
  autofocus?: boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  onInput?: (e: string) => void;
  // Because placeholder doesn't seem to give height to the textarea
  rows?: number;
};

export const AutogrowingInput = ({
  autofocus,
  className,
  placeholder,
  value,
  onInput,
  rows,
}: AutogrowingInputProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>(value);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  // Setting focus manually to avoid conflicting with scroll to top
  useEffect(() => {
    if (autofocus) {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 500);
    }
  });

  return (
    <div
      className={`AutogrowingInput ${className}`}
      data-replicated-value={inputValue}
    >
      <textarea
        ref={titleRef}
        rows={rows ?? 1}
        className={`AutogrowingInput__textarea ${className}`}
        onInput={(e) => {
          onInput && onInput(e.currentTarget.value);
          setInputValue(e.currentTarget.value);
        }}
        onClick={(e) => {
          e.stopPropagation();
          value && setInputValue(value);
        }}
        value={inputValue}
        placeholder={value ?? placeholder}
      />
    </div>
  );
};
