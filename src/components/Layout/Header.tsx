import Image from 'next/image';
import Link from 'next/link';
import {Disclosure} from '@headlessui/react';

import logo from '../../assets/king.png';
import {useUser} from '../../contexts/UserContext';
import {isAdmin} from '../../utils/acl';

export default function Header() {
  const {user, logout} = useUser();

  return (
    <Disclosure as="nav" className="bg-blue-dark sticky top-0 z-10">
      {({open, close}) => (
        <>
          <div className="container mx-auto">
            <div className="relative flex items-center justify-between h-20">
              <div className="absolute inset-y-0 left-0 flex items-center lg:hidden px-2">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="block h-6 w-6"
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="block h-6 w-6"
                      aria-hidden="true"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-end lg:items-stretch lg:justify-between">
                <div className="flex-shrink-0 flex items-center">
                  <span className="lg:absolute translate-y-1 lg:translate-y-9 h-20 lg:h-auto">
                    <Link href="/">
                      <a>
                        <Image
                          src={logo}
                          alt="magic-events.gg"
                          width="86"
                          height="117"
                          priority={true}
                          layout="fixed"
                        />
                      </a>
                    </Link>
                  </span>
                  <Link href="/">
                    <a>
                      <h1 className="text-primary text-xl font-bold lg:pl-24 hidden lg:block">
                        magic-events.gg
                      </h1>
                    </a>
                  </Link>
                </div>
                <div className="hidden lg:block sm:ml-6 h-full">
                  <div className="flex space-x-4">
                    <Link href="/organizzatori">
                      <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                        Organizzatori
                      </a>
                    </Link>
                    <Link href="/leghe-e-circuiti">
                      <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                        Leghe
                      </a>
                    </Link>
                    <Link href="/i-miei-eventi">
                      <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                        I miei eventi
                      </a>
                    </Link>
                    {user ? (
                      <>
                        {isAdmin(user) && (
                          <Link href="/admin">
                            <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                              Gestione negozio
                            </a>
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link href="/login">
                        <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                          Accedi
                        </a>
                      </Link>
                    )}
                    <Link href="/contatti">
                      <a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                        Contatti
                      </a>
                    </Link>
                    <a
                      href="https://www.facebook.com/magiceventsgg"
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium"
                    >
                      <svg
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 30 30"
                        className="h-6 w-6"
                      >
                        <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/organizzatori" passHref>
                <a
                  onClick={() => close()}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Organizzatori
                </a>
              </Link>
              <Link href="/leghe-e-circuiti" passHref>
                <a
                  onClick={() => close()}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Leghe
                </a>
              </Link>
              <Link href="/i-miei-eventi" passHref>
                <a
                  onClick={() => close()}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  I miei eventi
                </a>
              </Link>
              {user ? (
                <>
                  {isAdmin(user) && (
                    <Link href="/admin" passHref>
                      <a
                        onClick={() => close()}
                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        Gestione negozio
                      </a>
                    </Link>
                  )}
                  <a
                    onClick={() => close()}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <Link href="/login" passHref>
                  <a
                    onClick={() => close()}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Accedi
                  </a>
                </Link>
              )}
              <Link href="/contatti" passHref>
                <a
                  onClick={() => close()}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Contatti
                </a>
              </Link>
              <a
                onClick={() => close()}
                href="https://www.facebook.com/magiceventsgg"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Seguici su Facebook
              </a>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
