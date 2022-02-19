import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import slugify from 'slugify';
import {EventCardList} from '../components/EventList';
import LocationSearch from '../components/LocationSearch';
import {fetchEventByCoords} from '../utils/api';
import {fetchHomeEvents} from '../utils/firebase-server';

type PageProps = {
  tournaments: Tournament[];
};

const Home: NextPage<PageProps> = ({tournaments}) => {
  const [data, setData] = useState<Tournament[]>(tournaments);
  const [filter, setFilter] = useState<Format>();

  const [coords, setCoords] = useState<Coords>();

  const router = useRouter();

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
        <LocationSearch
          onPosition={setCoords}
          onCity={({name}) =>
            router.push(`/italia/${slugify(name, {lower: true})}`)
          }
        />
      </div>

      <nav className="bg-white drop-shadow-sm">
        <div className="max-w-screen-lg mx-auto h-16 flex flex-row  items-center gap-3 overflow-x-auto">
          <button
            className={
              filter === undefined ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter(undefined)}
          >
            Tutti
          </button>
          <button
            className={
              filter === 'modern' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('modern')}
          >
            Modern
          </button>
          <button
            className={
              filter === 'standard' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('standard')}
          >
            Standard
          </button>
          <button
            className={
              filter === 'legacy' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('legacy')}
          >
            Legacy
          </button>
          <button
            className={
              filter === 'pauper' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('pauper')}
          >
            Pauper
          </button>
          <button
            className={
              filter === 'pioneer' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('pioneer')}
          >
            Pioneer
          </button>
          <button
            className={
              filter === 'vintage' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('vintage')}
          >
            Vintage
          </button>
          <button
            className={
              filter === 'commander' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('commander')}
          >
            Commander
          </button>
          <button
            className={
              filter === 'draft' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('draft')}
          >
            Booster Draft
          </button>
          <button
            className={
              filter === 'sealed' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('sealed')}
          >
            Sealed Draft
          </button>
        </div>
      </nav>

      <article className="max-w-screen-lg mx-auto mt-10">
        <EventCardList
          events={data.filter(
            (t) => filter === undefined || t.format === filter
          )}
        />
      </article>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const tournaments = await fetchHomeEvents();

  return {
    props: {
      tournaments,
    },
    revalidate: 20,
  };
};
