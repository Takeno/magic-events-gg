import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import {PropsWithChildren} from 'react';
import EventBackground from '../../components/EventList/partials/EventBackground';
import {format} from '../../utils/dates';
import {fetchEventById} from '../../utils/firebase-server';

import staticMap from '../../assets/staticmap.png';
import Breadcrumb from '../../components/Breadcrumb';

type PageProps = {
  tournament: Tournament;
};

const SingleTournament: NextPage<PageProps> = ({tournament}) => {
  return (
    <>
      <Head>
        <title>
          Torneo {tournament.format} di {tournament.organizer.name} -
          magic-events.gg
        </title>
      </Head>

      <Breadcrumb
        items={[
          {
            href: '/italia/roma',
            text: 'Roma',
          },
          {
            href: '/italia/roma/modern',
            text: 'Modern',
          },
          {
            text: tournament.id,
          },
        ]}
      />

      <div className="max-w-screen-lg mx-auto mt-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-initial w-full md:w-2/3 bg-red-200 card p-4 flex items-center">
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
            <div className="card">
              <div className="px-4 md:px-12 pt-4 md:pt-8">
                <SectionTitle>Organizzatore</SectionTitle>

                <h3 className="text-3xl font-bold">
                  {tournament.organizer.name}
                </h3>

                <SectionTitle className="mt-6">Descrizione evento</SectionTitle>

                <p className="text-base">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  porta, quam id mollis scelerisque, lorem sapien dictum neque,
                  ac egestas nisi nisl a nulla. Vivamus laoreet congue congue.
                  Curabitur a nibh ut tortor luctus dictum. Etiam in nulla
                  scelerisque, finibus ex venenatis, pharetra lacus. Donec quis
                  tincidunt ex, quis facilisis tellus. Mauris quis elit
                  venenatis, hendrerit magna sit amet, mollis arcu. Pellentesque
                  vulputate dui eget pulvinar condimentum. Aliquam erat
                  volutpat. Nulla nisi velit, tempus quis mauris sed, consequat
                  maximus massa.
                </p>
              </div>

              <hr className="my-6" />
              <div className="px-4 md:px-12 pb-4 md:pb-8">
                <div className="flex flex-row">
                  <SectionTitle className="mr-2">
                    Condividi l{"'"}evento
                  </SectionTitle>
                  <img className="aspect-square w-6" alt="Twitter" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-initial w-full md:w-1/3">
            <div className="card p-4 md:p-8">
              <SectionTitle>Quando?</SectionTitle>
              <p className="first-letter:uppercase">
                {format(tournament.timestamp, 'EEEE, d MMMM')}
                <br />
                {format(tournament.timestamp, 'HH:mm')}
              </p>

              <SectionTitle className="mt-6">Dove?</SectionTitle>
              <p>Via Roma, 100 - 00100 Milano (MI)</p>

              <img src={staticMap.src} className="aspect-video mt-4" />

              <button className="bg-green-600 w-full py-1 pl-5 pr-2 text-white text-left flex justify-between rounded-sm mt-4">
                Iscriviti
                <span className="bg-white/30 px-1 rounded-sm">€ 20</span>
              </button>
            </div>
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
    revalidate: 20,
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
