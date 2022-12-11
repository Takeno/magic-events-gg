import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import slugify from 'slugify';
import Breadcrumb from '../../../components/Breadcrumb';
import cities from '../../../city.json';
import {fetchEventByCoords} from '../../../utils/firebase-server';
import {EventCardList} from '../../../components/EventList';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {trackFormat} from '../../../utils/tracking';
import {isFormat} from '../../../utils/formats';
import * as API from '../../../utils/api';
import useSWR from 'swr';

type PageProps = {
  tournaments: Tournament[];
  format: Format;
  city: {
    name: string;
    latitude: string;
    longitude: string;
  };
};

const STARTING_RADIUS = 100;
const RADIUS_KEY_STORAGE = 'radius';

const CityPage: NextPage<PageProps> = ({tournaments, city, format}) => {
  const [radius, setRadius] = useState(STARTING_RADIUS);

  const {data} = useSWR(
    `/italia/${city}/${format}/${radius}`,
    () =>
      API.fetchEventByCoords(
        {
          latitude: +city.latitude,
          longitude: +city.longitude,
        },
        radius
      ).then((tournaments) => tournaments.filter((t) => t.format === format)),
    {
      fallbackData: tournaments,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    const radiusFromStorage = localStorage.getItem(RADIUS_KEY_STORAGE);
    if (radiusFromStorage !== null) {
      setRadius(+radiusFromStorage);
    }
  }, []);

  useEffect(() => {
    trackFormat(format);
  }, [format]);

  return (
    <>
      <Head>
        <title>
          Tornei {format} a {city.name} | magic-events.gg
        </title>
        <meta
          name="description"
          content={`Tutti i tornei formato ${format} di Magic: The Gathering a ${city.name}`}
        />
      </Head>

      <Breadcrumb
        items={[
          {
            href: `/italia/${slugify(city.name, {lower: true})}`,
            text: city.name,
          },
          {
            text: format,
          },
        ]}
      />

      <nav className="bg-white drop-shadow-sm">
        <div className="max-w-screen-lg mx-auto h-16 flex flex-row  items-center gap-3 overflow-x-auto">
          <Link href={`/italia/${slugify(city.name, {lower: true})}`}>
            Tutti
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/modern`}
            className={
              format === 'modern' ? 'font-bold text-primary' : undefined
            }
          >
            Modern
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/standard`}
            className={
              format === 'standard' ? 'font-bold text-primary' : undefined
            }
          >
            Standard
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/legacy`}
            className={
              format === 'legacy' ? 'font-bold text-primary' : undefined
            }
          >
            Legacy
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/pauper`}
            className={
              format === 'pauper' ? 'font-bold text-primary' : undefined
            }
          >
            Pauper
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/pioneer`}
            className={
              format === 'pioneer' ? 'font-bold text-primary' : undefined
            }
          >
            Pioneer
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/vintage`}
            className={
              format === 'vintage' ? 'font-bold text-primary' : undefined
            }
          >
            Vintage
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/commander`}
            className={
              format === 'commander' ? 'font-bold text-primary' : undefined
            }
          >
            Commander
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/centurion`}
            className={
              format === 'centurion' ? 'font-bold text-primary' : undefined
            }
          >
            Centurion
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/draft`}
            className={
              format === 'draft' ? 'font-bold text-primary' : undefined
            }
          >
            Booster Draft
          </Link>
          <Link
            href={`/italia/${slugify(city.name, {lower: true})}/sealed`}
            className={
              format === 'sealed' ? 'font-bold text-primary' : undefined
            }
          >
            Sealed Deck
          </Link>
        </div>
      </nav>

      <article className="max-w-screen-lg mx-auto mt-10 w-full">
        <h2 className="text-2xl font-bold uppercase my-4">
          Tornei {format} a {city.name} nel raggio di{' '}
          <select
            value={radius}
            onChange={(e) => {
              setRadius(+e.target.value);
              localStorage.setItem(RADIUS_KEY_STORAGE, e.target.value);
            }}
          >
            <option value={300}>300</option>
            <option value={150}>150</option>
            <option value={100}>100</option>
            <option value={50}>50</option>
            <option value={25}>25</option>
          </select>{' '}
          km
        </h2>
        {data && <EventCardList events={data} />}
      </article>
    </>
  );
};

export default CityPage;

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const cityParam = context.params?.city;
  if (typeof cityParam !== 'string') {
    return {
      notFound: true,
    };
  }

  const format = context.params?.format;
  if (typeof format !== 'string' || !isFormat(format)) {
    return {
      notFound: true,
    };
  }

  const city = cities.find((c) => slugify(c.name, {lower: true}) === cityParam);

  if (city === undefined) {
    return {
      notFound: true,
    };
  }

  const tournaments = await fetchEventByCoords(
    +city.latitude,
    +city.longitude,
    STARTING_RADIUS
  );

  return {
    props: {
      tournaments: tournaments.filter((t) => t.format === format),
      city,
      format,
    },
    revalidate: 60 * 60 * 2,
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
