import type {NextPage} from 'next';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {FORM_ERROR} from 'final-form';
import {Form, Field} from 'react-final-form';
import {useUser} from '../contexts/UserContext';

type PageProps = {};

type SignupFormType = {
  email: string;
  password: string;
};

const Signup: NextPage<PageProps> = () => {
  const {signup} = useUser();

  const handleSubmit = async (data: SignupFormType) => {
    try {
      await signup(data.email, data.password);
    } catch (e: any) {
      return {
        [FORM_ERROR]: e.code,
      };
    }
  };

  return (
    <>
      <Head>
        <title>Tutti gli eventi di Magic vicino a te! - magic-events.gg</title>
      </Head>

      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Registra un nuovo account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hai già un account?{' '}
              <Link href="/login">
                <a className="font-medium text-indigo-600 hover:text-indigo-500">
                  {"Effettua l'accesso"}
                </a>
              </Link>
            </p>
          </div>
          <Form<SignupFormType>
            onSubmit={handleSubmit}
            render={({handleSubmit, submitting, submitError}) => (
              <form
                className="mt-8 space-y-6"
                action="#"
                onSubmit={handleSubmit}
              >
                {submitError && (
                  <p className="text-center text-red-600">{submitError}</p>
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                  />

                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Field
                    component="input"
                    name="password"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Registrati!
                </button>
              </form>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default Signup;
