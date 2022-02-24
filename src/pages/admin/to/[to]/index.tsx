import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import {format} from '../../../../utils/dates';
import Breadcrumb from '../../../../components/Breadcrumb';
import {fetchEventsByOrganizer} from '../../../../utils/api';

type PageProps = {};

const AdminOrganizerIndex: NextPage<PageProps> = () => {
  const router = useRouter();

  const organizerId = router.query.to as string;

  const {data: tournaments} = useSWR(
    `/admin/organizer/${organizerId}/events`,
    () => fetchEventsByOrganizer(organizerId)
  );
  // const {data: organizer} = useSWR(`/admin/organizer/${organizerId}`, () => fetchEventsByOrganizer(organizerId));

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: '/admin',
            text: 'Admin',
          },
          {
            text: 'Eventi',
          },
        ]}
      />
      <div className="container mx-auto pt-4">
        <h2 className="text-3xl font-bold my-4 ml-3">Eventi</h2>

        <div className="w-full flex flex-row justify-end my-4">
          <Link href={`/admin/to/${router.query.to}/new-event`}>
            <a className="underline">Aggiungi nuovo evento</a>
          </Link>
        </div>

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
                        Data
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Evento
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(tournaments || []).map((tournament) => (
                      <tr key={tournament.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="">
                            <div className="text-sm font-medium text-gray-900 first-letter:uppercase">
                              {format(tournament.timestamp, 'E, d MMM')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(tournament.timestamp, 'HH:mm')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {tournament.title}
                          </div>
                          <div className="text-sm text-gray-500 first-letter:uppercase">
                            {tournament.format}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link href={`/tournament/${tournament.id}`}>
                            <a
                              className="text-indigo-600 hover:text-indigo-900"
                              target="_blank"
                            >
                              Vedi evento
                            </a>
                          </Link>{' '}
                          -{' '}
                          <Link
                            href={`/admin/to/${organizerId}/${tournament.id}`}
                          >
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

export default AdminOrganizerIndex;
