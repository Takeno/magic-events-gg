import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Breadcrumb from '../components/Breadcrumb';
import Link from 'next/link';
import JsonLD from '../components/Meta/JsonLD';
import {getAbsoluteURL} from '../utils/url';
import {fetchAllOrganizers} from 'utils/db';

type PageProps = {
  organizers: Organizer[];
};

const Organizers: NextPage<PageProps> = ({organizers}) => {
  return (
    <>
      <Head>
        <title>
          Tutti gli organizzatori e i negozi di Magic su magic-events.gg
        </title>
        <meta
          name="description"
          content="Scopri tutti i negozi censiti su magic-events.gg e trova il torneo di Magic più vicino a te."
        />
      </Head>

      <Breadcrumb
        items={[
          {
            text: 'Organizzatori',
          },
        ]}
      />
      <JsonLD>
        {organizers.map((organizer) => ({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: organizer.name,
          url: getAbsoluteURL(`/to/${organizer.id}`),
        }))}
      </JsonLD>

      <article className="max-w-screen-xl mx-auto mt-10 w-full">
        <h1 className="text-3xl font-bold">Tutti gli organizzatori</h1>

        <p className="mt-2">
          Tutti gli organizzatori di tornei ed eventi presenti su
          magic-events.gg
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-1 mt-8">
          {organizers.map((to) => (
            <Link
              key={to.id}
              href={`/to/${to.id}`}
              className="card p-4 flex flex-row items-center"
            >
              {to.logo && (
                <div className="flex-shrink-0 relative h-14 w-14 rounded-full bg-white flex justify-center items-center mr-4">
                  <Image
                    className="rounded-full object-contain aspect-square"
                    src={to.logo}
                    alt={to.name}
                    width={50}
                    height={50}
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold">{to.name}</h3>
                {to.address && `${to.address.city} (${to.address.province})`}
              </div>
            </Link>
          ))}
        </div>
      </article>
    </>
  );
};

export default Organizers;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const organizers = await fetchAllOrganizers();

  return {
    props: {
      organizers,
    },
  };
};
