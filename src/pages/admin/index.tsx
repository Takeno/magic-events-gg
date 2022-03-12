import type {NextPage} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import Breadcrumb from '../../components/Breadcrumb';
import {useAdmin} from '../../contexts/UserContext';
import {fetchMyLeagues, fetchMyOrganizers} from '../../utils/api';

type PageProps = {};

const AdminIndex: NextPage<PageProps> = () => {
  useAdmin();

  const {data: organizers} = useSWR('/my-organizers', () =>
    fetchMyOrganizers()
  );

  const {data: leagues} = useSWR('/my-leagues', () => fetchMyLeagues());

  return (
    <>
      <Breadcrumb
        items={[
          {
            text: 'Admin',
          },
        ]}
      />
      <div className="container mx-auto pt-16">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Negozio
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Location
                      </th>

                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(organizers || []).map((to) => (
                      <tr key={to.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {to.logo && (
                              <div className="flex-shrink-0 relative h-10 w-10 rounded-full bg-white flex justify-center items-center">
                                <Image
                                  className="rounded-full"
                                  src={to.logo}
                                  alt={to.name}
                                  objectFit="contain"
                                  width={50}
                                  height={50}
                                />
                              </div>
                            )}
                            <div className="ml-4">
                              <Link href={`/admin/to/${to.id}`}>
                                <a className="text-md font-medium text-gray-900">
                                  {to.name}
                                </a>
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {to.location.address}
                            <br />
                            {to.location.city} ({to.location.province}),{' '}
                            {to.location.country}
                          </div>
                          <div className="text-sm text-gray-500">
                            {to.location.city}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/to/${to.id}`}>
                            <a className="text-indigo-600 hover:text-indigo-900">
                              Vedi scheda
                            </a>
                          </Link>{' '}
                          -{' '}
                          <Link href={`/admin/to/${to.id}/edit`}>
                            <a className="text-indigo-600 hover:text-indigo-900">
                              Modifica
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Leagues
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      ></th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(leagues || []).map((league) => (
                      <tr key={league.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {league.logo && (
                              <div className="flex-shrink-0 relative h-10 w-10 rounded-full bg-white flex justify-center items-center">
                                <Image
                                  className="rounded-full"
                                  src={league.logo}
                                  alt={league.name}
                                  objectFit="contain"
                                  width={50}
                                  height={50}
                                />
                              </div>
                            )}
                            <div className="ml-4">
                              <Link href={`/admin/leagues/${league.id}`}>
                                <a className="text-md font-medium text-gray-900">
                                  {league.name}
                                </a>
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/league/${league.id}`}>
                            <a className="text-indigo-600 hover:text-indigo-900">
                              Vedi scheda
                            </a>
                          </Link>{' '}
                          -{' '}
                          <Link href={`/admin/leagues/${league.id}/edit`}>
                            <a className="text-indigo-600 hover:text-indigo-900">
                              Modifica
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminIndex;
