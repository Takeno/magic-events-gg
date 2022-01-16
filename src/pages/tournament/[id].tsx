import type {GetStaticPaths, GetStaticProps, NextPage} from 'next';
import {fetchEventById} from '../../utils/firebase';

type PageProps = {
  tournament: Tournament;
};

const SingleTournament: NextPage<PageProps> = ({tournament}) => {
  return (
    <>
      <h1>Torneo {tournament.format}</h1>
      <h2>Ospitato da {tournament.venue}</h2>
      <h2>Quando: {new Date(tournament.timestamp).toLocaleString()}</h2>
    </>
  );
};

export default SingleTournament;

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  if (typeof context.params?.id !== 'string') {
    return {
      notFound: true,
    };
  }
  const tournament = await fetchEventById(context.params.id);

  if (tournament === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tournament,
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
