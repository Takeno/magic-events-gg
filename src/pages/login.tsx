import type {NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useUser} from '../contexts/UserContext';
import Breadcrumb from '../components/Breadcrumb';
import {Auth, ThemeSupa} from '@supabase/auth-ui-react';
import supabase from '../utils/supabase';
import {useEffect} from 'react';

type PageProps = {};

const Login: NextPage<PageProps> = () => {
  const router = useRouter();

  const {user} = useUser();

  useEffect(() => {
    if (user) {
      router.replace('/');
    }
  }, [router, user]);

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
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FBAE39',
                    brandAccent: '#FBAE39',
                  },
                },
              },
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Indirizzo Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Il tuo indirizzo email',
                  password_input_placeholder: 'La tua password',
                  button_label: 'Registrati',
                  loading_button_label: 'Creazione account in corso...',
                  social_provider_text: 'Sign in with',
                  link_text: 'Non hai un account? Registrati ora',
                },
                sign_in: {
                  email_label: 'Indirizzo Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Il tuo indirizzo email',
                  password_input_placeholder: 'La tua password',
                  button_label: 'Accedi',
                  loading_button_label: 'Accesso in corso...',
                  social_provider_text: 'Sign in with',
                  link_text: 'Hai già un account? Accedi',
                },
                magic_link: {
                  email_input_label: 'Email address',
                  email_input_placeholder: 'Your email address',
                  button_label: 'Send Magic Link',
                  link_text: 'Send a magic link email',
                },
                forgotten_password: {
                  email_label: 'Indirizzo Email',
                  password_label: 'Password',
                  email_input_placeholder: 'Il tuo indirizzo email',
                  button_label: 'Invia',
                  link_text: 'Hai dimenticato la password?',
                },
                update_password: {
                  password_label: 'Nuova password',
                  password_input_placeholder: '',
                  button_label: 'Aggiorna',
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Login;
