import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import slugify from 'slugify';
import {PropsWithChildren} from 'react';
import EventBackground from '../../components/EventList/partials/EventBackground';
import {format} from '../../utils/dates';
import {fetchEventById} from '../../utils/firebase-server';
import Breadcrumb from '../../components/Breadcrumb';

type PageProps = {
  tournament: Tournament;
};

const SingleTournament: NextPage<PageProps> = ({tournament}) => {
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

      <Breadcrumb
        items={[
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
        ]}
      />

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
                {tournament.title && (
                  <h2 className="text-xl font-bold">{tournament.title}</h2>
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
              <h3 className="text-xl font-bold">{tournament.organizer.name}</h3>

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
                  {tournament.location.address} - {tournament.location.city} (
                  {tournament.location.province})
                </a>
              </p>

              {/* <img src={staticMap.src} className="aspect-video mt-4" /> */}

              {/* <button className="bg-green-600 w-full py-1 pl-5 pr-2 text-white text-left flex justify-between rounded-sm mt-4">
                Iscriviti
                <span className="bg-white/30 px-1 rounded-sm">€ 20</span>
              </button> */}
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
