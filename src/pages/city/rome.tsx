import type {GetStaticProps, NextPage} from 'next';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {fetchEventByCoords} from '../../utils/firebase-server';

type PageProps = {
  tournaments: Tournament[];
};

const SingleCity: NextPage<PageProps> = ({tournaments}) => {
  const router = useRouter();

  return (
    <>
      <header>
        <Link href="/">
          <a>Torna alla lista</a>
        </Link>
      </header>
      <h1>Tornei di Roma</h1>
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

export default SingleCity;

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const tournaments = await fetchEventByCoords(
    41.8905227376549,
    12.492389585053866
  );

  return {
    props: {
      tournaments,
    },
    revalidate: 20,
  };
};
