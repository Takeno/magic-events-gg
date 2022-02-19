import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import slugify from 'slugify';
import Breadcrumb from '../../../components/Breadcrumb';
import cities from '../../../city.json';
import {fetchEventByCoords} from '../../../utils/firebase-server';
import {EventCardList} from '../../../components/EventList';
import Link from 'next/link';

type PageProps = {
  tournaments: Tournament[];
  format: string;
  city: {
    name: string;
  };
};

const CityPage: NextPage<PageProps> = ({tournaments, city, format}) => {
  return (
    <>
      <Head>
        <title>Tornei a {city.name} - magic-events.gg</title>
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
            <a>Tutti</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/modern`}>
            <a
              className={
                format === 'modern' ? 'font-bold text-primary' : undefined
              }
            >
              Modern
            </a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/standard`}>
            <a
              className={
                format === 'standard' ? 'font-bold text-primary' : undefined
              }
            >
              Standard
            </a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/legacy`}>
            <a
              className={
                format === 'legacy' ? 'font-bold text-primary' : undefined
              }
            >
              Legacy
            </a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/pauper`}>
            <a
              className={
                format === 'pauper' ? 'font-bold text-primary' : undefined
              }
            >
              Pauper
            </a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/pioneer`}>
            <a
              className={
                format === 'pioneer' ? 'font-bold text-primary' : undefined
              }
            >
              Pioneer
            </a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/vintage`}>
            <a
              className={
                format === 'vintage' ? 'font-bold text-primary' : undefined
              }
            >
              Vintage
            </a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/commander`}>
            <a
              className={
                format === 'commander' ? 'font-bold text-primary' : undefined
              }
            >
              Commander
            </a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/draft`}>
            <a
              className={
                format === 'draft' ? 'font-bold text-primary' : undefined
              }
            >
              Booster Draft
            </a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/sealed`}>
            <a
              className={
                format === 'sealed' ? 'font-bold text-primary' : undefined
              }
            >
              Sealed Draft
            </a>
          </Link>
        </div>
      </nav>

      <article className="max-w-screen-lg mx-auto mt-10">
        <h2 className="text-2xl font-bold uppercase my-4">
          Tornei {format} a {city.name}
        </h2>
        <EventCardList events={tournaments} />
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
  if (typeof format !== 'string') {
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
    50
  );

  return {
    props: {
      tournaments: tournaments.filter((t) => t.format === format),
      city,
      format,
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
