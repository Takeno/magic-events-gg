import type {GetServerSideProps, NextPage} from 'next';
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
            Torneo {event.format} - {event.venue}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const tournaments = await fetchAllEvents();

  return {
    props: {
      tournaments,
    },
  };
};
