import type {NextPage} from 'next';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useAdmin} from '../../contexts/UserContext';
import {fetchMyOrganizers} from '../../utils/api';

type PageProps = {};

const AdminIndex: NextPage<PageProps> = () => {
  const {user} = useAdmin();

  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  useEffect(() => {
    fetchMyOrganizers().then(setOrganizers);
  }, []);
  return (
    <>
      <div className="container mx-auto pt-16">
        <h1>Area Admin di {user.email}</h1>

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
                    {organizers.map((to) => (
                      <tr key={to.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src=""
                                alt="negozio1"
                              />
                            </div> */}
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
                            {to.address}
                          </div>
                          <div className="text-sm text-gray-500">{to.city}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
        </div>
      </div>
    </>
  );
};

export default AdminIndex;
