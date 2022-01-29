import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useUser} from '../contexts/UserContext';
import {fetchAllEvents} from '../utils/firebase-server';

type PageProps = {
  tournaments: Tournament[];
};

const Home: NextPage<PageProps> = ({tournaments}) => {
  const {user, logout} = useUser();

  return (
    <>
      <Head>
        <title>Tutti gli eventi di Magic vicino a te! - magic-events.gg</title>
      </Head>

      <Link href={`/city/rome`}>
        <a>Tornei di Roma</a>
      </Link>

      <br />

      {user ? (
        <>
          Bentornato. <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link href="/login">
          <a>Effettua il login</a>
        </Link>
      )}

      <h1>Tutti i tornei</h1>
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
