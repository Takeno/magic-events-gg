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
      {({open}) => (
        <>
          <div className="container mx-auto">
            <div className="relative flex items-center justify-between h-20">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden px-2">
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
              <div className="flex-1 flex items-center justify-end sm:items-stretch sm:justify-between">
                <div className="flex-shrink-0 flex items-center">
                  <span className="sm:absolute translate-y-1 sm:translate-y-9 h-20 sm:h-auto">
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
                      <h1 className="text-primary text-xl font-bold sm:pl-24 hidden sm:block">
                        magic-events.gg
                      </h1>
                    </a>
                  </Link>
                </div>
                <div className="hidden sm:block sm:ml-6 h-full">
                  <div className="flex space-x-4">
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

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  {isAdmin(user) && (
                    <Link href="/admin" passHref>
                      <Disclosure.Button
                        as="a"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      >
                        Gestione negozio
                      </Disclosure.Button>
                    </Link>
                  )}
                  <Disclosure.Button
                    as="button"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </Disclosure.Button>
                </>
              ) : (
                <Link href="/login" passHref>
                  <Disclosure.Button
                    as="a"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Accedi
                  </Disclosure.Button>
                </Link>
              )}
              <Link href="/contatti" passHref>
                <Disclosure.Button
                  as="a"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Contatti
                </Disclosure.Button>
              </Link>
              <Disclosure.Button
                as="a"
                href="https://www.facebook.com/magiceventsgg"
                target="_blank"
                rel="noreferrer"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Seguici su Facebook
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
