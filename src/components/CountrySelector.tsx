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
        onInput={(e) => onInput(e.currentTarget.value)}
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
