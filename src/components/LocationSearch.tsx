import {useCallback} from 'react';
import AsyncSelect from 'react-select/async';
import {autocompleteCity} from '../utils/api';

type LocationSearchProps = {
  onPosition: (coords: Coords) => void;
  onCity: (city: {name: string}) => void;
};

type SelectOption = {
  label: string;
  value: Coords & {
    name: string;
  };
};

export default function LocationSearch({
  onPosition,
  onCity,
}: LocationSearchProps) {
  const getUserPosition = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => onPosition({latitude, longitude}),
      (err) => console.error(err),
      {
        maximumAge: 30000,
        timeout: 10000,
      }
    );
  }, [onPosition]);

  const loadOptions = useCallback(
    async (inputValue: string, callback: (options: SelectOption[]) => void) => {
      if (inputValue.length < 3) {
        callback([]);
        return;
      }

      const results = await autocompleteCity(inputValue);

      callback(
        results.map((r) => ({
          label: r.name,
          value: r,
        }))
      );
    },
    []
  );

  const onCitySelect = useCallback(
    (input: SelectOption | null) => {
      if (input === null) {
        return;
      }

      onCity(input.value);
    },
    [onCity]
  );

  return (
    <div className="bg-white rounded-3xl flex flex-row items-center p-2 w-full max-w-[600px]">
      <span className="mx-4">Trova tornei:</span>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        onChange={onCitySelect}
        className="flex-1"
        placeholder="Città"
        noOptionsMessage={({inputValue}) =>
          inputValue.length < 3
            ? 'Digita almeno tre caratteri'
            : 'Nessuna città trovata'
        }
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 stroke-primary fill-primary mx-4 cursor-pointer"
        viewBox="0 0 20 20"
        onClick={getUserPosition}
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
