import axios from 'axios';
import {FORM_ERROR} from 'final-form';
import type {GetServerSideProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import {useCallback} from 'react';
import {Field, Form} from 'react-final-form';
import AsyncSelect from 'react-select/async';
import {validate} from 'validate.js';
import * as Sentry from '@sentry/nextjs';
import Breadcrumb from '../../../../components/Breadcrumb';
import Datetime from '../../../../components/Form/Datetime';
import Dropdown from '../../../../components/Form/Dropdown';
import NumericInput from '../../../../components/Form/NumericInput';
import Textarea from '../../../../components/Form/Textarea';
import TextInput from '../../../../components/Form/TextInput';
import {autocompleteCity, updateEvent} from '../../../../utils/api';
import {updateEventConstraints} from '../../../../utils/validation';
import {fetchEventById} from '../../../../utils/firebase-server';

type PageProps = {
  tournament: Tournament;
};

type FormType = Omit<Tournament, 'id' | 'organizer'>;

type SelectOption = {
  label: string;
  value: string;
};

const AdminTournamentEdit: NextPage<PageProps> = ({tournament}) => {
  const router = useRouter();

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
          value: r.name,
        }))
      );
    },
    []
  );

  const handleSubmit = async (data: FormType) => {
    const validationErrors = validate(data, updateEventConstraints);

    if (validationErrors !== undefined) {
      return {...validationErrors, location: validationErrors.location?.[0]};
    }

    try {
      await updateEvent(tournament.id, {
        format: data.format,
        timestamp: new Date(data.timestamp).getTime(),
        title: data.title,
        text: data.text,
        registrationLink: data.registrationLink,
        location: data.location,
      });
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        Sentry.captureException(e);
        return {
          [FORM_ERROR]: 'Si è verificato un errore.',
        };
      }

      if (e.response === undefined) {
        return {
          [FORM_ERROR]: 'Non è stato possibile inviare il form.',
        };
      }

      if (e.response.status === 400) {
        return e.response.data;
      }

      Sentry.captureException(e);
      return {
        [FORM_ERROR]: 'Si è verificato un errore.',
      };
    }

    router.push(`/admin/to/${tournament.organizer.id}`);
  };

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: '/admin',
            text: 'I miei negozi',
          },
          {
            text: 'Modifica evento',
          },
        ]}
      />

      <div className="max-w-screen-lg w-full mx-auto pt-4 px-2">
        <Form<FormType>
          initialValues={{
            ...tournament,
          }}
          onSubmit={handleSubmit}
          render={({handleSubmit, values, submitError, submitting}) => (
            <form onSubmit={handleSubmit} className="space-y-2">
              <h1 className="text-xl font-bold my-4">Modifica evento</h1>

              {submitError && (
                <span className="text-red-600">{submitError}</span>
              )}

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
                    options={[
                      {label: 'modern', value: 'modern'},
                      {label: 'legacy', value: 'legacy'},
                      {label: 'standard', value: 'standard'},
                      {label: 'pioneer', value: 'pioneer'},
                      {label: 'vintage', value: 'vintage'},
                      {label: 'commander', value: 'commander'},
                      {label: 'centurion', value: 'centurion'},
                      {label: 'pauper', value: 'pauper'},
                    ]}
                  />
                )}
              />

              <Field<FormType['timestamp']>
                name="timestamp"
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

              <Field<FormType['text']>
                name="text"
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

              <Field<EventLocation['venue']>
                name="location.venue"
                render={({input, meta}) => (
                  <TextInput
                    title="Nome venue"
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
              <Field<EventLocation['city']>
                name="location.city"
                render={({input, meta}) => (
                  <>
                    <label className="block font-medium">Città</label>
                    <AsyncSelect
                      cacheOptions
                      loadOptions={loadOptions}
                      defaultOptions
                      value={{value: input.value, label: input.value}}
                      onChange={(v) => input.onChange(v?.value)}
                      className="flex-1"
                      placeholder="Città"
                      noOptionsMessage={({inputValue}) =>
                        inputValue.length < 3
                          ? 'Digita almeno tre caratteri'
                          : 'Nessuna città trovata'
                      }
                    />
                    <span className="text-red-600">
                      {meta.error || meta.submitError}
                    </span>
                  </>
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

              <button
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  submitting ? 'bg-gray-600' : 'bg-primary'
                }`}
              >
                {submitting ? 'Salvatagio...' : 'Salva'}
              </button>
            </form>
          )}
        />
      </div>
    </>
  );
};

export default AdminTournamentEdit;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  if (typeof context.params?.id !== 'string') {
    return {
      notFound: true,
    };
  }

  const tournament = await fetchEventById(context.params.id);

  if (tournament === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tournament,
    },
  };
};
