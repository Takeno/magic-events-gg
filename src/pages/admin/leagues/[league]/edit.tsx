import axios from 'axios';
import {FORM_ERROR} from 'final-form';
import type {GetServerSideProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import {Field, Form} from 'react-final-form';
import {validate} from 'validate.js';
import * as Sentry from '@sentry/nextjs';
import Breadcrumb from '../../../../components/Breadcrumb';
import TextInput from '../../../../components/Form/TextInput';
import {updateLeague} from '../../../../utils/api';
import {updateLeagueConstraints} from '../../../../utils/validation';
import {fetchLeagueById} from '../../../../utils/firebase-server';
import Image from 'next/image';
import Textarea from '../../../../components/Form/Textarea';

type PageProps = {
  league: League;
};

type FormType = Pick<
  League,
  'text' | 'facebook' | 'whatsapp' | 'email' | 'website'
>;

const AdminTournamentCreate: NextPage<PageProps> = ({league}) => {
  const router = useRouter();

  const handleSubmit = async (data: FormType) => {
    const validationErrors = validate(data, updateLeagueConstraints);

    if (validationErrors !== undefined) {
      return validationErrors;
    }

    try {
      await updateLeague(league.id, data);
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

    router.push(`/admin`);
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
            text: `Modifica "${league.name}"`,
          },
        ]}
      />

      <div className="max-w-screen-lg w-full mx-auto pt-4 px-2">
        <Form<FormType, FormType>
          initialValues={{
            text: league.text,
            facebook: league.facebook,
            whatsapp: league.whatsapp,
            email: league.email,
            website: league.website,
          }}
          onSubmit={handleSubmit}
          render={({handleSubmit, values, submitError, submitting}) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h1 className="text-xl font-bold my-4">
                Modifica informazioni negozio
              </h1>

              {submitError && (
                <span className="text-red-600">{submitError}</span>
              )}

              <div>
                <span className="block font-medium">Nome</span>
                <span>{league.name}</span>
              </div>

              <div>
                <span className="block font-medium">Logo</span>
                {league.logo && (
                  <Image
                    src={league.logo}
                    alt={league.name}
                    objectFit="contain"
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

              <h3 className="text-xl font-bold">Social</h3>

              <Field<FormType['website']>
                name="website"
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

              <Field<FormType['facebook']>
                name="facebook"
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

              <Field<FormType['whatsapp']>
                name="whatsapp"
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

              <Field<FormType['email']>
                name="email"
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

export default AdminTournamentCreate;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  if (typeof context.params?.league !== 'string') {
    return {
      notFound: true,
    };
  }
  const league = await fetchLeagueById(context.params.league);

  if (league === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      league,
    },
  };
};
