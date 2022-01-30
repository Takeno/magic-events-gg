import type {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import {PropsWithChildren} from 'react';
import {UserProvider, useUser} from '../contexts/UserContext';
import '../styles/global.css';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <UserProvider>
      <PrivateAdminChecker>
        <Component {...pageProps} />
      </PrivateAdminChecker>
    </UserProvider>
  );
}

const PrivateAdminChecker = (props: PropsWithChildren<{}>) => {
  const {user, loading} = useUser();
  const router = useRouter();

  if (router.asPath.indexOf('/admin') !== 0) {
    return <>{props.children}</>;
  }

  if (user && user.roles.includes('ROLE_ADMIN')) {
    return <>{props.children}</>;
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return <h1>Unauthenticated</h1>;
};

export default MyApp;
