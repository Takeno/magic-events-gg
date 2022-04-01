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

  const breadcrumbItems = [];
  if (organizer.location) {
    breadcrumbItems.push({
      href: `/italia/${slugify(organizer.location.city, {
        lower: true,
      })}`,
      text: organizer.location.city,
    });
  }

  breadcrumbItems.push({
    text: organizer.name,
  });

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />

      <div className="card max-w-screen-lg mx-auto w-full mt-8 p-4">
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center">
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

        <div className="flex flex-col sm:flex-row justify-between items-center">
          {organizer.location && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${organizer.location.latitude}%2C${organizer.location.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block h-5 w-5 align-middle"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {organizer.location.address} - {organizer.location.city} (
              {organizer.location.province}) {organizer.location.country}
            </a>
          )}

          <div className="text-center min-w-[6rem]">
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
                  className="inline-block h-6 w-6"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z" />
                </svg>
              </a>
            )}
            {organizer.website && (
              <a
                href={organizer.website}
                target="_blank"
                className="text-blue-dark"
                rel="noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </a>
            )}
            {organizer.email && (
              <a href={`mailto:${organizer.email}`} className="text-blue-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            )}
            {organizer.whatsapp && (
              <a
                href={`https://wa.me/${organizer.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-dark"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M 12.011719 2 C 6.5057187 2 2.0234844 6.478375 2.0214844 11.984375 C 2.0204844 13.744375 2.4814687 15.462563 3.3554688 16.976562 L 2 22 L 7.2324219 20.763672 C 8.6914219 21.559672 10.333859 21.977516 12.005859 21.978516 L 12.009766 21.978516 C 17.514766 21.978516 21.995047 17.499141 21.998047 11.994141 C 22.000047 9.3251406 20.962172 6.8157344 19.076172 4.9277344 C 17.190172 3.0407344 14.683719 2.001 12.011719 2 z M 12.009766 4 C 14.145766 4.001 16.153109 4.8337969 17.662109 6.3417969 C 19.171109 7.8517969 20.000047 9.8581875 19.998047 11.992188 C 19.996047 16.396187 16.413812 19.978516 12.007812 19.978516 C 10.674812 19.977516 9.3544062 19.642812 8.1914062 19.007812 L 7.5175781 18.640625 L 6.7734375 18.816406 L 4.8046875 19.28125 L 5.2851562 17.496094 L 5.5019531 16.695312 L 5.0878906 15.976562 C 4.3898906 14.768562 4.0204844 13.387375 4.0214844 11.984375 C 4.0234844 7.582375 7.6067656 4 12.009766 4 z M 8.4765625 7.375 C 8.3095625 7.375 8.0395469 7.4375 7.8105469 7.6875 C 7.5815469 7.9365 6.9355469 8.5395781 6.9355469 9.7675781 C 6.9355469 10.995578 7.8300781 12.182609 7.9550781 12.349609 C 8.0790781 12.515609 9.68175 15.115234 12.21875 16.115234 C 14.32675 16.946234 14.754891 16.782234 15.212891 16.740234 C 15.670891 16.699234 16.690438 16.137687 16.898438 15.554688 C 17.106437 14.971687 17.106922 14.470187 17.044922 14.367188 C 16.982922 14.263188 16.816406 14.201172 16.566406 14.076172 C 16.317406 13.951172 15.090328 13.348625 14.861328 13.265625 C 14.632328 13.182625 14.464828 13.140625 14.298828 13.390625 C 14.132828 13.640625 13.655766 14.201187 13.509766 14.367188 C 13.363766 14.534188 13.21875 14.556641 12.96875 14.431641 C 12.71875 14.305641 11.914938 14.041406 10.960938 13.191406 C 10.218937 12.530406 9.7182656 11.714844 9.5722656 11.464844 C 9.4272656 11.215844 9.5585938 11.079078 9.6835938 10.955078 C 9.7955938 10.843078 9.9316406 10.663578 10.056641 10.517578 C 10.180641 10.371578 10.223641 10.267562 10.306641 10.101562 C 10.389641 9.9355625 10.347156 9.7890625 10.285156 9.6640625 C 10.223156 9.5390625 9.737625 8.3065 9.515625 7.8125 C 9.328625 7.3975 9.131125 7.3878594 8.953125 7.3808594 C 8.808125 7.3748594 8.6425625 7.375 8.4765625 7.375 z" />
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
