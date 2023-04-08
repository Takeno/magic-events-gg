import {FORM_ERROR, MutableState, Tools} from 'final-form';
import {useRouter} from 'next/router';
import {useCallback, useRef} from 'react';
import {Field, Form} from 'react-final-form';
import useSWR from 'swr';
import * as Sentry from '@sentry/nextjs';
import Breadcrumb from '../../../../components/Breadcrumb';
import CheckboxFlag from '../../../../components/Form/CheckboxFlag';
import Datetime from '../../../../components/Form/Datetime';
import Dropdown from '../../../../components/Form/Dropdown';
import NumericInput from '../../../../components/Form/NumericInput';
import Textarea from '../../../../components/Form/Textarea';
import TextInput from '../../../../components/Form/TextInput';
import {createEvent, fetchOrganizer} from '../../../../utils/db';
import formats from '@constants/formats';
import {ZodError} from 'zod';
import {mapZodErrorToFinalForm} from 'utils/form';
import ReactGoogleAutocomplete from 'react-google-autocomplete';

type FormType = Partial<
  Omit<Tournament, 'id' | 'organizer' | 'location' | 'startDate'> & {
    customLocation: boolean;
    location: Tournament['location'] | null;
    startDate: Date;
  }
>;

type SelectOption = {
  label: string;
  value: string;
};

const AdminTournamentCreate = () => {
  const router = useRouter();
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const {data: organizer, isLoading} = useSWR(
    `/organizer/${router.query.to}`,
    () => fetchOrganizer(router.query.to as string)
  );

  const handleSubmit = async (data: FormType) => {
    if (data.customLocation !== true) {
      data.location = null;
    }

    try {
      await createEvent({
        format: data.format,
        title: data.title,
        description: data.description,
        startDate: data.startDate?.toISOString(),
        startDateTz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        registrationLink: data.registrationLink,
        organizer: organizer!.id,
        onlineEvent: data.onlineEvent,
        location: data.onlineEvent
          ? null
          : data.customLocation
          ? data.location
          : {
              ...organizer!.address!,
              venue: organizer!.name,
            },
      });
    } catch (e) {
      if (e instanceof ZodError) {
        const errors = mapZodErrorToFinalForm(e);

        return {
          [FORM_ERROR]: errors.formErrors,
          ...errors.fieldErrors,
        };
      }

      Sentry.captureException(e);
      return {
        [FORM_ERROR]: 'Si è verificato un errore.',
      };
    }

    router.push(`/admin/to/${organizer!.id}`);
  };

  const handleAutocomplete = useCallback(
    (
      args: [google.maps.places.PlaceResult],
      state: MutableState<FormType>,
      utils: Tools<FormType>
    ) => {
      const [place] = args;

      if (place === undefined) {
        return;
      }

      const name =
        place.name &&
        !place.types?.includes('street_address') &&
        !place.types?.includes('route')
          ? place.name
          : '';

      const address = place.address_components?.find((c) =>
        c.types.includes('route')
      )?.long_name;

      const streetNumber = place.address_components?.find((c) =>
        c.types.includes('street_number')
      )?.long_name;

      const province = place.address_components?.find((c) =>
        c.types.includes('administrative_area_level_2')
      )?.short_name;

      const city = place.address_components?.find((c) =>
        c.types.includes('administrative_area_level_3')
      )?.short_name;

      utils.changeValue(state, 'location.venue', () => name || '');
      utils.changeValue(state, 'location.latitude', () =>
        place.geometry!.location!.lat()
      );
      utils.changeValue(state, 'location.longitude', () =>
        place.geometry!.location!.lng()
      );
      utils.changeValue(state, 'location.address', () =>
        address ? (streetNumber ? `${address}, ${streetNumber}` : address) : ''
      );

      utils.changeValue(state, 'location.province', () => province || '');
      utils.changeValue(state, 'location.city', () => city || '');

      autocompleteRef.current!.value = '';
    },
    []
  );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (organizer === null || organizer === undefined) {
    return <h2>Not found</h2>;
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: '/admin',
            text: 'I miei negozi',
          },
          {
            text: 'Nuovo evento',
          },
        ]}
      />

      <div className="max-w-screen-lg w-full mx-auto pt-4 px-2">
        <Form<FormType>
          mutators={{
            handleAutocomplete,
          }}
          initialValues={{
            onlineEvent: false,
            startDate: undefined,
            customLocation: organizer.address ? false : true,
          }}
          onSubmit={handleSubmit}
          render={({handleSubmit, values, submitError, submitting, form}) => (
            <form onSubmit={handleSubmit} className="space-y-2">
              <h1 className="text-xl font-bold my-4">Aggiungi nuovo evento</h1>

              <Field<FormType['title']>
                name="title"
                render={({input, meta}) => (
                  <TextInput
                    title="Titolo"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              <Field<FormType['format']>
                name="format"
                render={({input, meta}) => (
                  <Dropdown
                    title="Formato"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    placeholder="Formato"
                    error={meta.error || meta.submitError}
                    options={formats.map((f) => ({label: f, value: f}))}
                  />
                )}
              />

              <Field<FormType['startDate']>
                name="startDate"
                render={({input, meta}) => (
                  <Datetime
                    title="Quando"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              <Field<FormType['registrationLink']>
                name="registrationLink"
                render={({input, meta}) => (
                  <TextInput
                    title="Link registratione evento"
                    type="url"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              <Field<FormType['description']>
                name="description"
                render={({input, meta}) => (
                  <Textarea
                    title="Descrizione"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />
              {/* <Field<FormType['onlineEvent']>
                name="onlineEvent"
                render={({input, meta}) => (
                  <CheckboxFlag
                    title="È un evento online?"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              /> */}

              {!values.onlineEvent && organizer.address && (
                <Field<FormType['customLocation']>
                  name="customLocation"
                  render={({input, meta}) => (
                    <CheckboxFlag
                      title="La location è diversa da quella dell'organizzatore?"
                      name={input.name}
                      value={input.value}
                      onChange={input.onChange}
                      error={meta.error || meta.submitError}
                    />
                  )}
                />
              )}

              {values.onlineEvent || !values.customLocation || (
                <>
                  <h3 className="text-xl font-bold">Location</h3>
                  <div>
                    <label className="block font-medium">
                      Cerca qui la tua location
                    </label>

                    <div className="mt-1 relative rounded-md shadow-sm">
                      <ReactGoogleAutocomplete
                        className="block w-full border-gray-300 rounded-md"
                        // @ts-expect-error
                        type="text"
                        placeholder="Lascia compilare tutto a gooooogle"
                        ref={autocompleteRef}
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
                        onPlaceSelected={(place) =>
                          form.mutators.handleAutocomplete(place)
                        }
                        language="it"
                        options={{
                          componentRestrictions: {
                            country: ['it'],
                          },
                          types: ['store', 'point_of_interest', 'route'],
                          fields: [
                            'name',
                            'address_components',
                            'geometry.location',
                            'types',
                          ],
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field<EventLocation['venue']>
                      name="location.venue"
                      render={({input, meta}) => (
                        <TextInput
                          title="Location"
                          name={input.name}
                          value={input.value}
                          onChange={input.onChange}
                          error={meta.error || meta.submitError}
                        />
                      )}
                    />
                    <Field<EventLocation['address']>
                      name="location.address"
                      render={({input, meta}) => (
                        <TextInput
                          title="Indirizzo"
                          name={input.name}
                          value={input.value}
                          onChange={input.onChange}
                          error={meta.error || meta.submitError}
                        />
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Field<EventLocation['city']>
                      name="location.city"
                      render={({input, meta}) => (
                        <TextInput
                          title="Città"
                          name={input.name}
                          value={input.value}
                          onChange={input.onChange}
                          error={meta.error || meta.submitError}
                        />
                      )}
                    />
                    <Field<EventLocation['province']>
                      name="location.province"
                      render={({input, meta}) => (
                        <TextInput
                          title="Provincia"
                          name={input.name}
                          value={input.value}
                          onChange={input.onChange}
                          error={meta.error || meta.submitError}
                        />
                      )}
                    />
                    <Field<EventLocation['country']>
                      name="location.country"
                      render={({input, meta}) => (
                        <Dropdown
                          title="Paese"
                          name={input.name}
                          value={input.value}
                          onChange={input.onChange}
                          error={meta.error || meta.submitError}
                          options={[{label: 'Italia', value: 'Italy'}]}
                        />
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field<EventLocation['latitude']>
                      name="location.latitude"
                      render={({input, meta}) => (
                        <NumericInput
                          title="Latitudine"
                          name={input.name}
                          value={input.value}
                          onChange={input.onChange}
                          error={meta.error || meta.submitError}
                        />
                      )}
                    />
                    <Field<EventLocation['longitude']>
                      name="location.longitude"
                      render={({input, meta}) => (
                        <NumericInput
                          title="Longitudine"
                          name={input.name}
                          value={input.value}
                          onChange={input.onChange}
                          error={meta.error || meta.submitError}
                        />
                      )}
                    />
                  </div>
                </>
              )}

              {submitError && (
                <span className="text-red-600">{submitError}</span>
              )}

              <button
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  submitting ? 'bg-gray-600' : 'bg-primary'
                }`}
              >
                {submitting ? 'Salvataggio...' : 'Salva'}
              </button>
            </form>
          )}
        />
      </div>
    </>
  );
};

export default AdminTournamentCreate;
