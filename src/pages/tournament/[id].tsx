import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import slugify from 'slugify';
import {PropsWithChildren, useCallback, useEffect} from 'react';
import EventBackground from '../../components/EventList/partials/EventBackground';
import {format} from '../../utils/dates';
import {fetchEventById} from '../../utils/firebase-server';
import Breadcrumb from '../../components/Breadcrumb';
import Link from 'next/link';
import {trackEvent, trackEventSubscriptionLink} from '../../utils/tracking';
import JsonLD from '../../components/Meta/JsonLD';
import {getAbsoluteURL} from '../../utils/url';
import {useRouter} from 'next/router';

type PageProps = {
  tournament: Tournament;
};

const SingleTournament: NextPage<PageProps> = ({tournament}) => {
  const router = useRouter();

  useEffect(() => {
    trackEvent(tournament.id, tournament.format, tournament.organizer.id);
  }, [tournament]);

  const shareEvent = useCallback(() => {
    const shareData = {
      title: `Torneo ${tournament.format} di ${tournament.organizer.name}`,
      text: "Dai un'occhiata a questo torneo, ci andiamo?",
      url: getAbsoluteURL(router.asPath),
    };

    try {
      navigator.share(shareData);
    } catch (e) {}
  }, [tournament, router]);

  const breadcrumbItems = [
    {
      href: `/italia/${slugify(tournament.location.city, {lower: true})}`,
      text: tournament.location.city,
    },
    {
      href: `/italia/${slugify(tournament.location.city, {
        lower: true,
      })}/${tournament.format}`,
      text: tournament.format,
    },
    {
      text:
        tournament.title ||
        `Torneo ${tournament.format} di ${tournament.organizer.name}`,
    },
  ];

  return (
    <>
      <Head>
        <title>
          {tournament.title ||
            `Torneo ${tournament.format} di ${tournament.organizer.name}`}{' '}
          | magic-events.gg
        </title>
        <meta
          name="description"
          content={`${format(tournament.timestamp, 'EEEE d MMMM HH:mm')} - ${
            tournament.format
          } presso ${tournament.organizer.name}`}
        />
      </Head>

      <Breadcrumb items={breadcrumbItems} />

      <JsonLD>
        {[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbItems
              .slice(0, -1)
              .map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.text,
                item: getAbsoluteURL(item.href!),
              })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name:
              tournament.title ||
              `Torneo ${tournament.format} presso ${tournament.organizer.name}`,
            startDate: format(tournament.timestamp, "yyyy-MM-dd'T'HH:mmxxx"),
            eventAttendanceMode:
              'https://schema.org/OfflineEventAttendanceMode', // change if online event
            eventStatus: 'https://schema.org/EventScheduled',
            location: {
              '@type': 'Place',
              name: tournament.location.venue,
              address: {
                '@type': 'PostalAddress',
                streetAddress: tournament.location.address,
                addressLocality: tournament.location.city,
                addressRegion: tournament.location.province,
                addressCountry: tournament.location.country,
              },
            },
            organizer: {
              '@type': 'Organization',
              name: tournament.organizer.name,
              url: getAbsoluteURL(`/to/${tournament.organizer.id}`),
            },
          },
        ]}
      </JsonLD>

      <div className="max-w-screen-lg mx-auto mt-8 w-full">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-initial w-full md:w-2/3 bg-red-200 card p-4 flex items-center relative">
            <EventBackground event={tournament} />
            {tournament.organizer.logo && (
              <div className="flex-shrink-0 relative h-14 w-14 rounded-full bg-white flex justify-center items-center mr-2">
                <Image
                  className="rounded-full"
                  src={tournament.organizer.logo}
                  alt={tournament.organizer.name}
                  objectFit="contain"
                  width={50}
                  height={50}
                  priority
                />
              </div>
            )}

            <span className="relative text-white text-shadow-sm text-2xl font-bold uppercase">
              Torneo {tournament.format}
            </span>
          </div>

          <div className="flex-initial w-full md:w-1/3"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-initial w-full md:w-2/3">
            <div className="card py-4 md:py-8">
              <div className="px-4 md:px-12">
                {tournament.leagues.map((league) => (
                  <div
                    key={league.id}
                    className="flex flex-col-reverse sm:flex-row justify-between items-center pb-4 mb-4 border-b-2"
                  >
                    <h3 className="text-lg font-bold">
                      Certificato{' '}
                      <Link href={`/league/${league.id}`}>
                        <a className="text-primary hover:underline">
                          {league.name}
                        </a>
                      </Link>
                    </h3>

                    {league.logo && (
                      <div className="flex-shrink-0 relative h-20 w-30 bg-white flex justify-center items-center mr-2">
                        <Image
                          src={league.logo}
                          alt={league.name}
                          objectFit="contain"
                          width={120}
                          height={75}
                          priority
                        />
                      </div>
                    )}
                  </div>
                ))}
                {tournament.title && (
                  <h2 className="text-xl font-bold">{tournament.title}</h2>
                )}
                {typeof navigator !== 'undefined' && navigator.share && (
                  <p className="my-4">
                    Interessato all&apos;evento?{' '}
                    <button
                      onClick={shareEvent}
                      className="text-blue-dark font-medium"
                    >
                      Clicca qui per condividere
                    </button>
                  </p>
                )}
                <div className="space-y-2">
                  {(tournament.text || '').split('\n').map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* <hr className="my-6" />
              <div className="px-4 md:px-12 pb-4 md:pb-8">
                <div className="flex flex-row">
                  <SectionTitle className="mr-2">
                    Condividi l{"'"}evento
                  </SectionTitle>
                  <img className="aspect-square w-6" alt="Twitter" />
                </div>
              </div> */}
            </div>
          </div>

          <div className="flex-initial w-full md:w-1/3">
            <aside className="card p-4 md:p-8 sticky top-20">
              <SectionTitle>Organizzatore</SectionTitle>
              <Link href={`/to/${tournament.organizer.id}`}>
                <a>
                  <h3 className="text-xl font-bold">
                    {tournament.organizer.name}
                  </h3>
                </a>
              </Link>

              <SectionTitle className="mt-6">Quando?</SectionTitle>
              <p className="first-letter:uppercase">
                {format(tournament.timestamp, 'EEEE, d MMMM')}
                <br />
                {format(tournament.timestamp, 'HH:mm')}
              </p>

              <SectionTitle className="mt-6">Dove?</SectionTitle>
              <p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${tournament.location.latitude}%2C${tournament.location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {tournament.location.venue}
                  {tournament.location.venue && <br />}
                  {tournament.location.address}
                  <br />
                  {tournament.location.city} ({tournament.location.province})
                </a>
              </p>

              {/* <img src={staticMap.src} className="aspect-video mt-4" /> */}

              {tournament.registrationLink && (
                <a
                  href={tournament.registrationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-dark w-full p-4 text-primary font-bold flex items-center uppercase rounded-md mt-4"
                  onClick={() =>
                    trackEventSubscriptionLink(
                      tournament.id,
                      tournament.format,
                      tournament.organizer.id
                    )
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  Iscriviti
                </a>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

const SectionTitle = ({
  children,
  className,
}: PropsWithChildren<{className?: string}>) => (
  <h3 className={`text-lg font-bold text-orange-600 ${className}`}>
    {children}
  </h3>
);

export default SingleTournament;

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  if (typeof context.params?.id !== 'string') {
    return {
      notFound: true,
    };
  }
  const tournament = await fetchEventById(context.params.id);

  if (tournament === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tournament,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // const tournaments = await fetchAllEvents();
  // const paths = tournaments.map((tournament) => ({
  //   params: {id: tournament.id},
  // }));

  // Do not generate statically any event
  // but do it at runtime
  const paths: string[] = [];

  return {paths, fallback: 'blocking'};
};
