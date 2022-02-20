import type {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import Script from 'next/script';
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
        <div className="flex flex-col flex-1">
          <PrivateAdminChecker>
            <Component {...pageProps} />
          </PrivateAdminChecker>
        </div>
        <Footer />
      </main>

      {process.env.NEXT_PUBLIC_GTAG && (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTAG}');`}
        </Script>
      )}
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
