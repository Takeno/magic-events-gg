import Link from 'next/link';
import {useCallback, useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import useSWR from 'swr';
import Breadcrumb from '../components/Breadcrumb';
import {useRequiredUser, useUser} from '../contexts/UserContext';
import {autocompleteCity, fetchMyEvents, saveMyEvents} from '../utils/api';
import {EventCardList} from '../components/EventList';

type SelectOption = {
  label: string;
  value: Coords & {
    name: string;
  };
};

type FormatOption = {
  label: string;
  value: Format;
};

export default function MyEvents() {
  const {user, loading} = useUser();

  if (loading) {
    return (
      <>
        <Breadcrumb
          items={[
            {
              text: 'I miei eventi',
            },
          ]}
        />

        <article className="max-w-screen-md mx-auto mt-4">
          <h2 className="text-3xl font-bold my-4">I miei eventi</h2>
          <p>
            Tu ci dici quali formati giochi e in quali città, noi ti segnaliamo
            i prossimi tornei ed eventi che ti possono interessare.
          </p>

          <svg
            className="animate-spin h-10 w-10 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </article>
      </>
    );
  }

  if (user === null) {
    return (
      <>
        <Breadcrumb
          items={[
            {
              text: 'I miei eventi',
            },
          ]}
        />

        <article className="max-w-screen-md mx-auto mt-4">
          <h2 className="text-3xl font-bold my-4">I miei eventi</h2>
          <p>
            Tu ci dici quali formati giochi e in quali città, noi ti segnaliamo
            i prossimi tornei ed eventi che ti possono interessare.
          </p>

          <h3 className="text-xl font-bold mt-10 text-center">
            Attenzione: questa funzionalità è disponibile esclusivamente per gli
            utenti registrati.
          </h3>

          <div className="text-center mt-4">
            <Link href="/login">
              <a className="underline">Accedi</a>
            </Link>{' '}
            -{' '}
            <Link href="/signup">
              <a className="underline">Registrati</a>
            </Link>
          </div>
        </article>
      </>
    );
  }
  return <MyEventForm />;
}

function MyEventForm() {
  const {user} = useRequiredUser();
  const [cities, setCities] = useState<SelectOption[]>(() =>
    user.cities.map((city) => ({
      label: city,
      value: {
        name: city,
        latitude: 0,
        longitude: 0,
      },
    }))
  );
  const [formats, setFormats] = useState<FormatOption[]>(() =>
    user.formats.map((format) => ({
      label: format,
      value: format,
    }))
  );

  const {data, isValidating, mutate} = useSWR(
    () => (cities.length && formats.length ? '/my-events' : null),
    () =>
      fetchMyEvents(
        cities.map((c) => c.value.name),
        formats.map((f) => f.value)
      ),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    mutate();

    if (
      cities.length !== user.cities.length ||
      formats.length !== user.formats.length
    ) {
      saveMyEvents(
        cities.map((o) => o.value.name),
        formats.map((o) => o.value)
      );
    }
  }, [cities, formats, mutate, user.formats, user.cities]);

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

  return (
    <>
      <Breadcrumb
        items={[
          {
            text: 'I miei eventi',
          },
        ]}
      />

      <article className="max-w-screen-md mx-auto mt-4">
        <h2 className="text-3xl font-bold my-4">I miei eventi</h2>
        <p>
          Tu ci dici quali formati giochi e in quali città, noi ti segnaliamo i
          prossimi tornei ed eventi che ti possono interessare.
        </p>

        <div className="grid grid-cols-6 gap-6 mt-6">
          <div className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Città
            </label>
            <AsyncSelect
              cacheOptions
              loadOptions={loadOptions}
              value={cities}
              isOptionSelected={(option, selected) =>
                selected.some((s) => s.value.name === option.value.name)
              }
              isMulti
              defaultOptions
              onChange={(cities) => setCities(cities.concat([]))}
              className="flex-1"
              placeholder="In che città giochi?"
              noOptionsMessage={({inputValue}) =>
                inputValue.length < 3
                  ? 'Digita almeno tre caratteri'
                  : 'Nessuna città trovata'
              }
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Formato
            </label>
            <Select
              isMulti
              value={formats}
              onChange={(formats) => setFormats(formats.concat([]))}
              placeholder="Quali formati giochi?"
              options={[
                {value: 'modern', label: 'Modern'},
                {value: 'legacy', label: 'Legacy'},
                {value: 'standard', label: 'Standard'},
                {value: 'pioneer', label: 'Pioneer'},
                {value: 'vintage', label: 'Vintage'},
                {value: 'commander', label: 'Commander'},
                {value: 'pauper', label: 'Pauper'},
                {value: 'draft', label: 'Booster Draft'},
                {value: 'sealed', label: 'Sealed Deck'},
              ]}
            />
          </div>
        </div>
      </article>

      <article className="max-w-screen-lg mx-auto mt-10 w-full">
        {isValidating && (
          <svg
            className="animate-spin h-10 w-10 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}

        {!isValidating && data !== undefined && (
          <>
            <h2 className="text-2xl font-bold my-4">Gli eventi per te</h2>
            <EventCardList events={data || []} />
          </>
        )}
      </article>
    </>
  );
}
