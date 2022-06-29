import type {AppProps} from 'next/app';
import {useRouter} from 'next/router';
import Head from 'next/head';
import Script from 'next/script';
import {PropsWithChildren} from 'react';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import {UserProvider, useUser} from '../contexts/UserContext';
import {isAdmin} from '../utils/acl';
import {getAbsoluteURL} from '../utils/url';
import '../styles/global.css';

import graphImage from '../assets/graph-image.png';

function MyApp({Component, pageProps}: AppProps) {
  return (
    <UserProvider>
      <Head>
        <meta
          key="og:image"
          property="og:image"
          content={getAbsoluteURL(graphImage.src)}
        />

        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="magic-events.gg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="magic-events.gg" />
        <meta
          name="description"
          content="The best locator for your magic events"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#131431" />

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/app-icons/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/app-icons/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/app-icons/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/app-icons/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/app-icons/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/app-icons/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/app-icons/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/app-icons/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/app-icons/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/app-icons/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/app-icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/app-icons/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/app-icons/favicon-16x16.png"
        />
      </Head>
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
