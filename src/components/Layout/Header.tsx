import Image from 'next/image';
import Link from 'next/link';
import logo from '../../assets/king.png';
import {useUser} from '../../contexts/UserContext';
import Button, {ButtonLink} from '../Buttons';

export default function Header() {
  const {user, logout} = useUser();

  return (
    <header className="bg-blue-dark h-20 sticky top-0 z-10">
      <div className="container text-white h-full mx-auto flex flex-row justify-between items-center">
        <div className="h-full flex row items-center">
          <span className="translate-y-9 mr-6">
            <Image src={logo} alt="magic-events.gg" width="86" height="117" />
          </span>
          <h1 className="text-2xl text-primary">
            <Link href="/">
              <a>magic-events.gg</a>
            </Link>
          </h1>
        </div>

        <div className="flex row items-center gap-4">
          {user ? (
            <>
              <Button onClick={logout} outline>
                Esci
              </Button>

              <Link href="/profile" passHref>
                <ButtonLink>Profilo</ButtonLink>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup" passHref>
                <ButtonLink outline>Registrati</ButtonLink>
              </Link>

              <Link href="/login" passHref>
                <ButtonLink>Accedi</ButtonLink>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
