import type {NextPage} from 'next';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {FORM_ERROR} from 'final-form';
import {Form, Field} from 'react-final-form';
import {useUser} from '../contexts/UserContext';
import Breadcrumb from '../components/Breadcrumb';

type PageProps = {};

type SignupFormType = {
  email: string;
};

const PasswordReset: NextPage<PageProps> = () => {
  const {resetPasswordRequest} = useUser();

  const handleSubmit = async (data: SignupFormType) => {
    try {
      await resetPasswordRequest(data.email);
    } catch (e: any) {
      console.log(e);
      return {
        [FORM_ERROR]: e.code,
      };
    }
  };

  return (
    <>
      <Head>
        <title>Recupera password - magic-events.gg</title>
      </Head>

      <Breadcrumb
        items={[
          {
            text: 'Recupero password',
          },
        ]}
      />

      <div className="flex-1 flex items-center justify-center px-2">
        <div className="max-w-xl w-full">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recupero password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inserisci la tua email per avviare la procedura di recupero
            password.
          </p>

          <Form<SignupFormType>
            onSubmit={handleSubmit}
            render={({
              handleSubmit,
              submitting,
              submitError,
              submitSucceeded,
            }) => (
              <form
                className="mt-8 space-y-6"
                action="#"
                onSubmit={handleSubmit}
              >
                {submitError && (
                  <p className="text-center text-red-600">{submitError}</p>
                )}
                {submitSucceeded && (
                  <p className="text-center text-green-600">
                    È stata inviata una mail per il recupero password.
                  </p>
                )}
                <div className="rounded-md shadow-sm -space-y-px">
                  <label htmlFor="email-address" className="sr-only">
                    Email
                  </label>
                  <Field
                    component="input"
                    name="email"
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Email"
                  />
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Invia
                </button>
              </form>
            )}
          />
          <p className="mt-2 text-center text-sm text-gray-600">
            Hai già un account?{' '}
            <Link
              href="/login"
              className="font-medium text-blue-dark hover:underline"
            >
              {"Effettua l'accesso"}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
