import { useEffect, useRef, useState } from "react";

import "../styles/AutogrowingInput.css";

type AutogrowingInputProps = {
  autoFocus?: boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  onInput?: (e: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  passwordManager?: "disable" | "enable";
  // Because placeholder doesn't seem to give height to the textarea
  rows?: number;
  // For country selector to be small by default
  cols?: number;
};

export const AutogrowingInput = ({
  autoFocus,
  className,
  placeholder,
  value,
  onInput,
  rows,
  cols,
  onFocus,
  onBlur,
  passwordManager,
}: AutogrowingInputProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>(value);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Setting focus manually to avoid conflicting with scroll to top
  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 500);
    }
  }, [autoFocus]);

  return (
    <div
      className={`AutogrowingInput ${className}`}
      data-replicated-value={inputValue}
    >
      <textarea
        ref={titleRef}
        rows={rows ?? 1}
        // 20 Is the default
        cols={cols ?? 20}
        className={`AutogrowingInput__textarea ${className}`}
        onInput={(e) => {
          onInput && onInput(e.currentTarget.value);
          setInputValue(e.currentTarget.value);
        }}
        onClick={(e) => {
          e.stopPropagation();
          value && setInputValue(value);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        value={inputValue}
        placeholder={placeholder}
        autoComplete={passwordManager === "disable" ? "off" : undefined}
        data-lpignore={passwordManager === "disable" ? "true" : undefined}
        data-form-type={passwordManager === "disable" ? "other" : undefined}
      />
    </div>
  );
};
