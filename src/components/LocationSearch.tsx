import {useCallback, useState} from 'react';
import AsyncSelect from 'react-select/async';
import {autocompleteCity} from '../utils/api';

type LocationSearchProps = {
  onPosition: (coords: Coords) => void;
};

type SelectOption = {
  label: string;
  value: Coords;
};

export default function LocationSearch({onPosition}: LocationSearchProps) {
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

      onPosition({
        latitude: input.value.latitude,
        longitude: input.value.longitude,
      });
    },
    [onPosition]
  );

  return (
    <div className="py-10 bg-blue-400">
      Cerca a:
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        onChange={onCitySelect}
      />
      <button onClick={getUserPosition}>Usa GPS</button>
    </div>
  );
}
