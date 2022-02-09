import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import {useEffect, useState} from 'react';
import {EventCardList} from '../components/EventList';
import LocationSearch from '../components/LocationSearch';
import {fetchEventByCoords} from '../utils/api';
import {fetchAllEvents} from '../utils/firebase-server';

type PageProps = {
  tournaments: Tournament[];
};

const Home: NextPage<PageProps> = ({tournaments}) => {
  const [data, setData] = useState<Tournament[]>(tournaments);

  const [coords, setCoords] = useState<Coords>();

  useEffect(() => {
    if (coords === undefined) {
      return;
    }

    fetchEventByCoords(coords).then(setData);
  }, [coords]);

  return (
    <>
      <Head>
        <title>Tutti gli eventi di Magic vicino a te! - magic-events.gg</title>
      </Head>

      <div className="bg-primary h-[70vh] min-h-[300px] md:h-1/3 flex flex-col items-center justify-center">
        <h2 className="text-white text-3xl uppercase font-bold text-center mb-4">
          Tutti gli eventi di Magic intorno a te
        </h2>
        <LocationSearch onPosition={setCoords} />
      </div>

      <nav className="bg-white drop-shadow-sm">
        <div className="max-w-screen-lg mx-auto h-16 flex flex-row  items-center gap-3 overflow-x-auto">
          <a className="font-bold text-primary">Tutti</a>
          <a>Modern</a>
          <a>Pauper</a>
          <a>Pauper</a>
          <a>Pauper</a>
          <a>Pauper</a>
          <a>Pauper</a>
          <a>Pauper</a>
          <a>Pauper</a>
          <a>Pauper</a>
          <a>Pauper</a>
        </div>
      </nav>

      <article className="max-w-screen-lg mx-auto mt-10">
        <EventCardList events={data} />
      </article>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const tournaments = await fetchAllEvents();

  return {
    props: {
      tournaments,
    },
    revalidate: 20,
  };
};
