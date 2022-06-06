import { COUNTRY_FLAGS } from "../constants/constants";
import { AutogrowingInput } from "./AutogrowingInput";
import { useEffect, useRef, useState } from "react";

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
      <AutogrowingInput placeholder={placeholder} />
      <span className="CountrySelector__dropdownArrow">^</span>
      {/* Hack to grow input along with content */}
      <span
        className="CountrySelector__input CountrySelector__span"
        ref={spanRef}
        dangerouslySetInnerHTML={{ __html: input.replace(/\s/g, "&nbsp;") }}
      ></span>
      {showDropDown && (
        <ul className="CountrySelector__dropdown">
          {COUNTRY_FLAGS.filter((country) =>
            country.short_name
              ? country.short_name.toUpperCase().indexOf(input.toUpperCase()) >
                -1
              : country.name.toUpperCase().indexOf(input.toUpperCase()) > -1
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
