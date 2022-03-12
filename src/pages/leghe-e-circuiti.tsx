import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import slugify from 'slugify';
import {EventCardList} from '../components/EventList';
import LocationSearch from '../components/LocationSearch';
import {
  fetchAllLeagues,
  fetchAllOrganizers,
  fetchHomeEvents,
} from '../utils/firebase-server';

import home from '../assets/home.jpg';
import Breadcrumb from '../components/Breadcrumb';
import Link from 'next/link';

type PageProps = {
  leagues: League[];
};

const Leagues: NextPage<PageProps> = ({leagues}) => {
  return (
    <>
      <Head>
        <title>Tutte le leghe e i circuiti di Magic</title>
        <meta
          name="description"
          content="Scopri tutti i tornei appartenenti ad una lega o circuito di Magic"
        />
      </Head>

      <Breadcrumb
        items={[
          {
            text: 'Leghe e circuiti',
          },
        ]}
      />

      <article className="max-w-screen-xl mx-auto mt-10 w-full">
        <h1 className="text-3xl font-bold">Leghe e circuiti</h1>

        <p className="mt-2">
          Tutti i circuiti e leghe di tornei presenti su magic-events.gg
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-1 mt-8">
          {leagues.map((league) => (
            <Link key={league.id} href={`/league/${league.id}`}>
              <a className="card p-4 flex flex-row items-center">
                {league.logo && (
                  <div className="flex-shrink-0 relative h-14 w-14 rounded-full bg-white flex justify-center items-center mr-4">
                    <Image
                      className="rounded-full"
                      src={league.logo}
                      alt={league.name}
                      objectFit="contain"
                      width={50}
                      height={50}
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">{league.name}</h3>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </article>
    </>
  );
};

export default Leagues;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const leagues = await fetchAllLeagues();

  return {
    props: {
      leagues,
    },
  };
};
