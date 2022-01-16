import type {GetStaticProps, NextPage} from 'next';
import Link from 'next/link';
import {fetchAllEvents} from '../utils/firebase';

type PageProps = {
  tournaments: Tournament[];
};

const Home: NextPage<PageProps> = ({tournaments}) => {
  return (
    <>
      <h1>It works!</h1>
      <ul>
        {tournaments.map((event) => (
          <li key={event.id}>
            <Link href={`/tournament/${event.id}`}>
              <a>
                Torneo {event.format} - {event.venue}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const tournaments = await fetchAllEvents();

  return {
    props: {
      tournaments,
    },
    revalidate: 20,
  };
};
