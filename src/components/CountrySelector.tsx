import { useEffect, useState, useCallback } from "react";
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
  const [inputSize, setInputSize] = useState<number>();
  const [value, setValue] = useState<string | undefined>(countryFlag);

  const onInputCallback = useCallback(
    (country: string) => {
      onInput(country);
    },
    [onInput]
  );

  useEffect(() => {
    if (value && value.length > 0) {
      onInputCallback(value);
      setInputSize(value.length);
    } else if (placeholder) {
      setInputSize(placeholder.length);
    }
  }, [value, onInputCallback, placeholder]);

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
        onBlur={(e) => {
          // Select the first item in the list
          if (e.target.value !== "") {
            const bestMatch = COUNTRY_FLAGS.filter(
              (country) =>
                (`${country.name} ${country.short_name}` || country.name)
                  .toUpperCase()
                  .indexOf(e.target.value.toUpperCase()) > -1
            );
            setValue(bestMatch[0] ? bestMatch[0].flag : "");
          }
        }}
        value={value}
        size={inputSize}
        onInput={(e) => {
          setValue(e.currentTarget.value);
          // Duplicating this in the onInput to avoid glitchy behavior
          if (e.currentTarget.value.length > 0) {
            setInputSize(e.currentTarget.value.length);
          } else if (placeholder) {
            setInputSize(placeholder.length);
          }
        }}
      />
      <datalist id="countries">
        {COUNTRY_FLAGS.map((country) => {
          return (
            <option
              key={country.name}
              label={
                country.short_name
                  ? `${country.name} ${country.short_name}`
                  : country.name
              }
              value={country.flag}
            />
          );
        })}
      </datalist>
    </>
  );
};
