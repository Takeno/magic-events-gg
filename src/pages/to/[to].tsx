import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import Image from 'next/image';
import slugify from 'slugify';
import useSWR from 'swr';
import {fetchOrganizerById} from '../../utils/firebase-server';
import Breadcrumb from '../../components/Breadcrumb';
import {fetchPublicEventsByOrganizer} from '../../utils/api';
import {EventCardList} from '../../components/EventList';

type PageProps = {
  organizer: Organizer;
};

const SingleTournament: NextPage<PageProps> = ({organizer}) => {
  const {data} = useSWR(
    `/organizer/${organizer.id}/events`,
    () => fetchPublicEventsByOrganizer(organizer.id),
    {revalidateOnFocus: false}
  );

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: `/italia/${slugify(organizer.location.city, {lower: true})}`,
            text: organizer.location.city,
          },
          {
            text: organizer.name,
          },
        ]}
      />

      <div className="card max-w-screen-lg mx-auto w-full mt-8 p-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold">{organizer.name}</h1>
          {organizer.logo && (
            <div className="flex-shrink-0 relative h-24 w-24">
              <Image
                className="rounded-full"
                src={organizer.logo}
                alt={organizer.name}
                objectFit="contain"
                width={150}
                height={150}
              />
            </div>
          )}
        </div>

        <div className="flex flex-row justify-between items-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${organizer.location.latitude}%2C${organizer.location.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {organizer.location.address} - {organizer.location.city} (
            {organizer.location.province}) {organizer.location.country}
          </a>

          <div className="w-24 text-center">
            {organizer.facebook && (
              <a
                href={organizer.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-blue-dark"
              >
                <svg
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                  className="inline-block h-10 w-10"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <article className="max-w-screen-lg mx-auto mt-10 w-full">
        <h2 className="text-2xl font-bold uppercase my-4">I prossimi tornei</h2>
        {data && data.length > 0 ? (
          <EventCardList events={data} />
        ) : (
          <p>Nessun torneo in programma.</p>
        )}
      </article>
    </>
  );
};

export default SingleTournament;

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  if (typeof context.params?.to !== 'string') {
    return {
      notFound: true,
    };
  }
  const organizer = await fetchOrganizerById(context.params.to);

  if (organizer === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      organizer,
    },
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
