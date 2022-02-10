import type {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import {PropsWithChildren} from 'react';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import {UserProvider, useUser} from '../contexts/UserContext';
import {isAdmin} from '../utils/acl';
import '../styles/global.css';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <UserProvider>
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <PrivateAdminChecker>
            <Component {...pageProps} />
          </PrivateAdminChecker>
        </div>
        <Footer />
      </main>
    </UserProvider>
  );
}

const PrivateAdminChecker = (props: PropsWithChildren<{}>) => {
  const {user, loading} = useUser();
  const router = useRouter();

  if (router.asPath.indexOf('/admin') !== 0) {
    return <>{props.children}</>;
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (isAdmin(user)) {
    return <>{props.children}</>;
  }

  return <h1>Unauthenticated</h1>;
};

export default MyApp;
