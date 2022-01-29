import {useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useUser} from '../contexts/UserContext';

type PageProps = {};

const Login: NextPage<PageProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useUser();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await login(email, password);

    router.replace('/');
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
              {"Effettua l'accesso"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Hai già un account?{' '}
              <Link href="/signup">
                <a className="font-medium text-indigo-600 hover:text-indigo-500">
                  Registrati ora!
                </a>
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
