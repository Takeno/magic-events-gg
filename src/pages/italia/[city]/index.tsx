import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import {useEffect, useState} from 'react';
import Head from 'next/head';
import slugify from 'slugify';
import Breadcrumb from '../../../components/Breadcrumb';
import cities from '../../../city.json';
import {fetchEventByCoords} from '../../../utils/firebase-server';
import {EventCardList} from '../../../components/EventList';
import Link from 'next/link';
import * as API from '../../../utils/api';
import useSWR, {SWRConfig} from 'swr';

type PageProps = {
  tournaments: Tournament[];
  city: {
    name: string;
    latitude: string;
    longitude: string;
  };
};

const STARTING_RADIUS = 100;
const RADIUS_KEY_STORAGE = 'radius';

const CityPage: NextPage<PageProps> = ({tournaments, city}) => {
  const [radius, setRadius] = useState(STARTING_RADIUS);

  const {data} = useSWR(
    `/italia/${city.name}/${radius}`,
    () =>
      API.fetchEventByCoords(
        {
          latitude: +city.latitude,
          longitude: +city.longitude,
        },
        radius
      ),
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

  return (
    <>
      <Head>
        <title>Tornei a {city.name} | magic-events.gg</title>
        <meta
          name="description"
          content={`Tutti i tornei di Magic: The Gathering a ${city.name}`}
        />
      </Head>

      <Breadcrumb
        items={[
          {
            text: city.name,
          },
        ]}
      />

      <nav className="bg-white drop-shadow-sm">
        <div className="max-w-screen-lg mx-auto h-16 flex flex-row  items-center gap-3 overflow-x-auto">
          <Link href={`/italia/${slugify(city.name, {lower: true})}`}>
            <a className="font-bold text-primary">Tutti</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/modern`}>
            <a>Modern</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/standard`}>
            <a>Standard</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/legacy`}>
            <a>Legacy</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/pauper`}>
            <a>Pauper</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/pioneer`}>
            <a>Pioneer</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/vintage`}>
            <a>Vintage</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/commander`}>
            <a>Commander</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/centurion`}>
            <a>Centurion</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/draft`}>
            <a>Booster Draft</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/sealed`}>
            <a>Sealed Deck</a>
          </Link>
        </div>
      </nav>

      <article className="max-w-screen-lg mx-auto mt-10 w-full">
        <h2 className="text-2xl font-bold uppercase my-4">
          Tornei a {city.name} nel raggio di{' '}
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
      tournaments,
      city,
    },
    revalidate: 60 * 5,
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
