import type {NextPage} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import placeholder from '../assets/not-found-placeholder.png';

const NotFoundPage: NextPage<{}> = () => {
  return (
    <div className="flex-1 flex justify-center items-center flex-col px-4">
      <Image src={placeholder} alt="Not found" aria-hidden="true" />

      <h1 className="text-4xl font-bold text-blue-dark mt-8">
        Ops, sembra che non ci sia connessione.
      </h1>

      <p className="mt-4">
        Attendi di tornare online, oppure torna alla
        <Link href="/" className="underline">
          home
        </Link>
        .
      </p>
    </div>
  );
};

export default NotFoundPage;
