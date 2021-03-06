import type {NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FORM_ERROR} from 'final-form';
import {Form, Field} from 'react-final-form';
import {useUser} from '../contexts/UserContext';
import Breadcrumb from '../components/Breadcrumb';

type PageProps = {};

type LoginFormType = {
  email: string;
  password: string;
};

const Login: NextPage<PageProps> = () => {
  const {login} = useUser();
  const router = useRouter();

  const handleSubmit = async (data: LoginFormType) => {
    try {
      await login(data.email, data.password);
      router.replace('/');
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

      <Breadcrumb
        items={[
          {
            text: 'Accedi',
          },
        ]}
      />

      <div className="flex-1 flex items-center justify-center px-2">
        <div className="max-w-xl w-full">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {"Effettua l'accesso"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Non hai ancora un account?{' '}
            <Link href="/signup">
              <a className="font-medium text-blue-dark hover:underline">
                Registrati ora!
              </a>
            </Link>
          </p>
          <Form<LoginFormType>
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    submitting ? 'bg-gray-600' : 'bg-primary'
                  }`}
                >
                  Accedi
                </button>
              </form>
            )}
          />
          <p className="mt-2 text-center text-sm text-gray-600">
            Hai dimenticato la password?{' '}
            <Link href="/password-reset">
              <a className="font-medium text-blue-dark hover:underline">
                Recupera password
              </a>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
