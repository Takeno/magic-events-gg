import {useCallback} from 'react';

type LocationSearchProps = {
  onPosition: (coords: Coords) => void;
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

  return (
    <div className="py-10 bg-blue-400">
      Cerca a:
      <input placeholder="city" />
      <button onClick={getUserPosition}>Usa GPS</button>
    </div>
  );
}
