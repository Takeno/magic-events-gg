import type {NextPage} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import placeholder from '../assets/not-found-placeholder.png';

const NotFoundPage: NextPage<{}> = () => {
  return (
    <div className="flex-1 flex justify-center items-center flex-col px-4">
      <Image src={placeholder} alt="Not found" aria-hidden="true" />

      <h1 className="text-4xl font-bold text-blue-dark mt-8">
        Ops, la pagina che cerchi non esiste.
      </h1>
      <p>O non è stata ancora sviluppata.</p>

      <p className="mt-4">
        Se pensi sia un errore, non esitare a{' '}
        <Link href="/contatti" className="underline">
          contattarci
        </Link>{' '}
        per migliorare il servizio.
      </p>
    </div>
  );
};

export default NotFoundPage;
