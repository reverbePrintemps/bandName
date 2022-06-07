import { useState } from "react";
import { COUNTRY_FLAGS } from "../constants/constants";

import "../styles/CountrySelector.css";

type CountrySelectorProps = {
  placeholder?: string;
  countryFlag?: string;
  onInput: (country: string) => void;
};

export const CountrySelector = ({
  placeholder,
  countryFlag,
  onInput,
}: CountrySelectorProps) => {
  const [input, setInput] = useState<number>();
  return (
    <>
      <input
        className="CountrySelector"
        type="text"
        name="country"
        list="countries"
        placeholder={placeholder}
        autoComplete="off"
        data-lpignore="true"
        data-form-type="other"
        onClick={(e) => {
          e.stopPropagation();
        }}
        value={countryFlag}
        onInput={(e) => {
          setInput(e.currentTarget.value.length);
          onInput(e.currentTarget.value);
        }}
        size={input}
      />
      <datalist id="countries">
        {COUNTRY_FLAGS.map((country) => {
          return (
            <option
              key={country.name}
              label={country.name}
              value={country.flag}
            />
          );
        })}
      </datalist>
    </>
  );
};
