import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import {useEffect, useState} from 'react';
import Head from 'next/head';
import slugify from 'slugify';
import Breadcrumb from '../../components/Breadcrumb';
import cities from '../../city.json';
import {EventCardList} from '../../components/EventList';
import Link from 'next/link';
import useSWR from 'swr';
import {fetchNearbyEvents} from '../../utils/db';
import {z} from 'zod';
import countries from '../../constants/countries';
import formats, {Format} from '../../constants/formats';
import {PublicConfiguration} from 'swr/_internal';

type PageWithSWR<T> = T & {
  swr?: Partial<PublicConfiguration>;
};

type PageProps = {
  country: string;
  city: string;
  cityObject: {
    name: string;
    latitude: string;
    longitude: string;
  };
  format: Format | null;
};

const STARTING_RADIUS = 100;
const RADIUS_KEY_STORAGE = 'radius';

const CityPage: NextPage<PageProps> = ({city, country, format, cityObject}) => {
  const [radius, setRadius] = useState(STARTING_RADIUS);

  const {data} = useSWR(
    `/${country}/${city}/${format}/${radius}`,
    () =>
      fetchNearbyEvents(
        +cityObject.latitude,
        +cityObject.longitude,
        radius,
        format || undefined
      ),
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
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
        <title>Tornei a {cityObject.name} | magic-events.gg</title>
        <meta
          name="description"
          content={`Tutti i tornei di Magic: The Gathering a ${cityObject.name}`}
        />
      </Head>

      <Breadcrumb
        items={[
          {
            href: `/${country}/${city}`,
            text: city,
          },
        ].concat(
          format
            ? {
                href: `/${country}/${city}/${format}`,
                text: format,
              }
            : []
        )}
      />

      <nav className="bg-white drop-shadow-sm">
        <div className="max-w-screen-lg mx-auto h-16 flex flex-row  items-center gap-3 overflow-x-auto">
          <Link
            href={`/${country}/${city}`}
            className={format === null ? 'font-bold text-primary' : undefined}
          >
            Tutti
          </Link>
          {formats.map((f) => (
            <Link
              key={f}
              href={`/${country}/${city}/${f}`}
              className={
                format === f
                  ? 'font-bold text-primary first-letter:uppercase'
                  : 'first-letter:uppercase'
              }
            >
              {f}
            </Link>
          ))}
        </div>
      </nav>

      <article className="max-w-screen-lg mx-auto mt-10 w-full">
        <h2 className="text-2xl font-bold uppercase my-4">
          Tornei a {cityObject.name} nel raggio di{' '}
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

export const getStaticProps: GetStaticProps<PageWithSWR<PageProps>> = async (
  context
) => {
  const ParamsSchema = z.object({
    parts: z
      .tuple([z.enum(countries), z.string()])
      .or(z.tuple([z.enum(countries), z.string(), z.enum(formats).optional()])),
  });

  const validation = ParamsSchema.safeParse(context.params);

  if (validation.success === false) {
    return {
      notFound: true,
    };
  }

  const [country, city, format] = validation.data.parts;

  const cityObject = cities.find(
    (c) => slugify(c.name, {lower: true}) === city
  );

  if (cityObject === undefined) {
    return {
      notFound: true,
    };
  }

  const tournaments = await fetchNearbyEvents(
    +cityObject.latitude,
    +cityObject.longitude,
    STARTING_RADIUS,
    format
  );

  return {
    props: {
      country,
      cityObject,
      city,
      format: format || null,
      swr: {
        fallback: {
          [`/${country}/${city}/${format || null}/${STARTING_RADIUS}`]:
            tournaments,
        },
      },
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
