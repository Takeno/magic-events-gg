import type {GetStaticProps, NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import LocationSearch from '../components/LocationSearch';
import {useUser} from '../contexts/UserContext';
import {fetchEventByCoords} from '../utils/api';
import {fetchAllEvents} from '../utils/firebase-server';

type PageProps = {
  tournaments: Tournament[];
};

const Home: NextPage<PageProps> = ({tournaments}) => {
  const {user, logout} = useUser();

  const [data, setData] = useState<Tournament[]>(tournaments);

  const [coords, setCoords] = useState<Coords>();

  useEffect(() => {
    if (coords === undefined) {
      return;
    }

    fetchEventByCoords(coords).then(setData);
  }, [coords]);

  return (
    <>
      <Head>
        <title>Tutti gli eventi di Magic vicino a te! - magic-events.gg</title>
      </Head>

      <Link href={`/city/rome`}>
        <a>Tornei di Roma</a>
      </Link>

      <br />

      <UserHeader user={user} logout={logout} />

      <LocationSearch onPosition={setCoords} />

      <h1>Tutti i tornei</h1>
      <ul>
        {data.map((event) => (
          <li key={event.id}>
            <Link href={`/tournament/${event.id}`}>
              <a>
                Torneo {event.format} - {event.venue} [{event.location.latitude}
                , {event.location.longitude}]
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

type UserHeaderType = {
  user: User | null;
  logout: () => void;
};

const UserHeader = ({user, logout}: UserHeaderType) => {
  if (!user) {
    return (
      <Link href="/login">
        <a>Effettua il login</a>
      </Link>
    );
  }

  return (
    <>
      Bentornato {user.email}.
      <br />
      {user.roles.includes('ROLE_ADMIN') && (
        <Link href="/admin">
          <a>Admin</a>
        </Link>
      )}
      <br />
      <button onClick={logout}>Logout</button>
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
