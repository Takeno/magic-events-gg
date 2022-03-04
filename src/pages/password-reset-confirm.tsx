import type {NextPage} from 'next';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FORM_ERROR} from 'final-form';
import {Form, Field} from 'react-final-form';
import {useUser} from '../contexts/UserContext';
import Breadcrumb from '../components/Breadcrumb';

type PageProps = {};

type SignupFormType = {
  password: string;
};

const PasswordResetConfirm: NextPage<PageProps> = () => {
  const router = useRouter();
  const {resetPasswordConfirm} = useUser();

  const handleSubmit = async (data: SignupFormType) => {
    try {
      const token = router.query.oobCode;

      if (typeof token !== 'string') {
        return {
          [FORM_ERROR]: 'Invalid token',
        };
      }

      await resetPasswordConfirm(token, data.password);
    } catch (e: any) {
      return {
        [FORM_ERROR]: e.code,
      };
    }
  };

  return (
    <>
      <Head>
        <title>Conferma recupero password - magic-events.gg</title>
      </Head>

      <Breadcrumb
        items={[
          {
            text: 'Conferma recupero password',
          },
        ]}
      />

      <div className="flex-1 flex items-center justify-center px-2">
        <div className="max-w-xl w-full">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Conferma recupero password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inserisci la nuova password:
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
                    Password modificata! Adesso puoi fare il{' '}
                    <Link href="/login">
                      <a className="font-medium text-blue-dark hover:underline">
                        login
                      </a>
                    </Link>
                    .
                  </p>
                )}
                <div className="rounded-md shadow-sm -space-y-px">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Field
                    component="input"
                    name="password"
                    id="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Nuova password"
                  />
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Salva
                </button>
              </form>
            )}
          />
          <p className="mt-2 text-center text-sm text-gray-600">
            Hai già un account?{' '}
            <Link href="/login">
              <a className="font-medium text-blue-dark hover:underline">
                {"Effettua l'accesso"}
              </a>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default PasswordResetConfirm;
