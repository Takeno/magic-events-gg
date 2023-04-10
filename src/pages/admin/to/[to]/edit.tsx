import axios from 'axios';
import {FORM_ERROR} from 'final-form';
import {useRouter} from 'next/router';
import {Field, Form} from 'react-final-form';
import * as Sentry from '@sentry/nextjs';
import Breadcrumb from '../../../../components/Breadcrumb';
import TextInput from '../../../../components/Form/TextInput';
import Image from 'next/image';
import MarkdownEditor from '../../../../components/Form/MarkdownEditor';
import useSWR from 'swr';
import {fetchOrganizer, updateOrganizer} from '../../../../utils/db';

type FormType = Pick<Organizer, 'description' | 'contacts'>;

const OrganizerEdit = () => {
  const router = useRouter();
  const {
    data: organizer,
    isLoading,
    mutate,
  } = useSWR(`/organizer/${router.query.to}`, () =>
    fetchOrganizer(router.query.to as string)
  );

  const handleSubmit = async (data: FormType) => {
    try {
      await updateOrganizer(organizer!.id, data);
      mutate();
      router.push(`/admin`);
    } catch (e) {
      console.error(e);
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
  };

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
            text: `Modifica "${organizer.name}"`,
          },
        ]}
      />

      <div className="max-w-screen-lg w-full mx-auto pt-4 px-2">
        <Form<FormType, FormType>
          initialValues={{
            description: organizer.description,
            contacts: organizer.contacts,
          }}
          onSubmit={handleSubmit}
          render={({handleSubmit, values, submitError, submitting}) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="text-xl font-bold my-4">
                Modifica informazioni negozio
              </h1>

              <div>
                <span className="block font-medium">Nome</span>
                <span>{organizer.name}</span>
              </div>

              {organizer.address && (
                <div>
                  <span className="block font-medium">Posizione</span>
                  <span>
                    {organizer.address.address} - {organizer.address.city} (
                    {organizer.address.province}) {organizer.address.country}
                  </span>
                </div>
              )}

              <div>
                <span className="block font-medium">Logo</span>
                {organizer.logo && (
                  <Image
                    className="rounded-full object-contain aspect-square"
                    src={organizer.logo}
                    alt={organizer.name}
                    width={50}
                    height={50}
                  />
                )}
              </div>

              <p>
                Per modificare i dati di base, mandare una richiesta tramite{' '}
                <a
                  href="https://forms.gle/J1ChYbfGnJaZm8xw9"
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-semibold"
                >
                  questo modulo
                </a>
                .
              </p>

              <Field<FormType['description']>
                name="description"
                render={({input, meta}) => (
                  <MarkdownEditor
                    title="Descrizione"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              <h3 className="text-xl font-bold">Social</h3>

              <Field<FormType['contacts']['website']>
                name="contacts.website"
                render={({input, meta}) => (
                  <TextInput
                    title="Website"
                    name={input.name}
                    type="url"
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              <Field<FormType['contacts']['discord']>
                name="contacts.discord"
                render={({input, meta}) => (
                  <TextInput
                    title="Discord"
                    name={input.name}
                    type="url"
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              <Field<FormType['contacts']['facebook']>
                name="contacts.facebook"
                render={({input, meta}) => (
                  <TextInput
                    title="Pagina Facebook"
                    name={input.name}
                    type="url"
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              <Field<FormType['contacts']['whatsapp']>
                name="contacts.whatsapp"
                render={({input, meta}) => (
                  <TextInput
                    title="Numero/Gruppo Whatsapp"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              <Field<FormType['contacts']['email']>
                name="contacts.email"
                render={({input, meta}) => (
                  <TextInput
                    title="Email"
                    type="email"
                    name={input.name}
                    value={input.value}
                    onChange={input.onChange}
                    error={meta.error || meta.submitError}
                  />
                )}
              />

              {submitError && (
                <span className="text-red-600">{submitError}</span>
              )}

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

export default OrganizerEdit;
