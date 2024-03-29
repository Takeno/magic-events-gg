import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import slugify from 'slugify';
import {EventCardList} from '../components/EventList';
import LocationSearch from '../components/LocationSearch';
import {fetchHomeEvents} from '../utils/db';

import home from '../assets/home.jpg';
import {isFormat} from '../utils/formats';
import {trackFormat} from '../utils/tracking';
import JsonLD from '../components/Meta/JsonLD';
import {formatTimeZoned} from '../utils/dates';
import {getAbsoluteURL} from '../utils/url';

type PageProps = {
  tournaments: Tournament[];
};

const Home: NextPage<PageProps> = ({tournaments}) => {
  const [filter, setFilter] = useState<Format>();

  const router = useRouter();

  useEffect(() => {
    const f = window.location.hash?.slice(1);
    if (isFormat(f)) {
      setFilter(f);
    }
  }, []);

  useEffect(() => {
    if (filter === undefined) {
      return;
    }

    trackFormat(filter);
  }, [filter]);

  return (
    <>
      <Head>
        <title>
          Scopri eventi e tornei di Magic vicino a te! - magic-events.gg
        </title>
        <meta
          name="description"
          content="magic-events.gg è un aggregatore di eventi e tornei di Magic. Trova i tornei di Magic vicino a te!"
        />
      </Head>

      <JsonLD>
        {tournaments.map((tournament) => ({
          '@context': 'https://schema.org',
          '@type': 'Event',
          name:
            tournament.title ||
            `Torneo ${tournament.format} presso ${tournament.organizer.name}`,
          description: `Torneo ${tournament.format} presso ${tournament.organizer.name}`,
          startDate: formatTimeZoned(
            tournament.startDate,
            tournament.startDateTz,
            "yyyy-MM-dd'T'HH:mmxxx"
          ),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: tournament.onlineEvent
            ? 'https://schema.org/OnlineEventAttendanceMode'
            : 'https://schema.org/OfflineEventAttendanceMode',
          location: tournament.onlineEvent
            ? {
                '@type': 'VirtualLocation',
              }
            : {
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
        }))}
      </JsonLD>

      <div className="bg-blue-dark h-[70vh] min-h-[300px] md:h-1/3 flex flex-col items-center justify-center relative px-2">
        <Image
          src={home}
          alt=""
          aria-hidden="true"
          fill
          className="blur-sm opacity-40 object-cover"
          priority={true}
        />
        <div className="relative">
          <h2 className="text-white text-3xl uppercase font-bold text-center mb-4">
            Tutti i tornei di Magic intorno a te
          </h2>
          <LocationSearch
            onPosition={() => {}}
            onCity={({name}) =>
              router.push(`/italia/${slugify(name, {lower: true})}`)
            }
          />
        </div>
      </div>

      <nav className="bg-white drop-shadow-sm">
        <div className="max-w-screen-lg mx-auto h-16 flex flex-row items-center gap-3 overflow-x-auto px-2">
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
              filter === 'centurion' ? 'font-bold text-primary' : undefined
            }
            onClick={() => setFilter('centurion')}
          >
            Centurion
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
            Sealed Deck
          </button>
        </div>
      </nav>

      <article className="max-w-screen-lg mx-auto mt-10 w-full">
        <EventCardList
          events={tournaments.filter(
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
    revalidate: 60 * 60 * 2,
  };
};
