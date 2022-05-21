import { useEffect, useRef, useState } from "react";
import { COUNTRY_FLAGS } from "../constants/constants";

import "../styles/CountrySelector.css";

type CountrySelectorProps = {
  placeholder: string;
  country: string;
  onChange: (e: string) => void;
};

export const CountrySelector = ({
  country,
  onChange,
  placeholder,
}: CountrySelectorProps) => {
  const [input, setInput] = useState(country);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const spanRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState<number | undefined>(
    spanRef.current?.offsetWidth
  );

  useEffect(() => {
    setInputWidth(spanRef.current?.offsetWidth);
  }, [spanRef.current?.offsetWidth]);

  useEffect(() => {
    onChange(input);
  }, [input]);

  return (
    <div className="CountrySelector">
      <div className="CountrySelector__inputContainer">
        <input
          className="CountrySelector__input"
          placeholder={placeholder}
          value={country}
          onChange={(e) => {
            setInput(e.currentTarget.value);
          }}
          style={{ width: `${inputWidth}px` }}
          onFocus={() => setShowDropDown(true)}
          onBlur={() => setShowDropDown(false)}
          // Prevent password managers autocomplete
          autoComplete="off"
          data-lpignore="true"
          data-form-type="other"
        />
        <span className="CountrySelector__dropdownArrow">^</span>
      </div>
      {/* Hack to grow input along with content */}
      <span
        className="CountrySelector__input CountrySelector__span"
        ref={spanRef}
        dangerouslySetInnerHTML={{ __html: input.replace(/\s/g, "&nbsp;") }}
      ></span>
      {showDropDown && (
        <ul className="CountrySelector__dropdown">
          {COUNTRY_FLAGS.filter(
            (country) =>
              country.name.toUpperCase().indexOf(input.toUpperCase()) > -1
          ).map((item) => (
            <li
              className="CountrySelector__country"
              key={item.name}
              value={item.name}
              // onMouseDown instead of onClick to prevent race condition with onBlur
              onMouseDown={() => setInput(item.flag)}
            >
              {item.flag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
