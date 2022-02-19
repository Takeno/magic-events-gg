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
  city: {
    name: string;
  };
};

const CityPage: NextPage<PageProps> = ({tournaments, city}) => {
  return (
    <>
      <Head>
        <title>Tornei a {city.name} - magic-events.gg</title>
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
          <Link href={`/italia/${slugify(city.name, {lower: true})}/undefined`}>
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
          <Link href={`/italia/${slugify(city.name, {lower: true})}/draft`}>
            <a>Booster Draft</a>
          </Link>
          <Link href={`/italia/${slugify(city.name, {lower: true})}/sealed`}>
            <a>Sealed Draft</a>
          </Link>
        </div>
      </nav>

      <article className="max-w-screen-lg mx-auto mt-10">
        <h2 className="text-2xl font-bold uppercase my-4">
          Tornei a {city.name}
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
      tournaments,
      city,
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
