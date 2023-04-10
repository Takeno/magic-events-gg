import type {NextPage} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import Breadcrumb from '../../components/Breadcrumb';
import {useAdmin} from '../../contexts/UserContext';
import {fetchOrganizersManagedBy} from '../../utils/db';

type PageProps = {};

const AdminIndex: NextPage<PageProps> = () => {
  const {user} = useAdmin();

  const {data: organizers} = useSWR(
    `/user/${user.id}/organizers`,
    () => fetchOrganizersManagedBy(user.id),
    {fallbackData: []}
  );

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
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(organizers || []).map((organizer) => (
            <li
              key={organizer.id}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
            >
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-xl font-medium text-gray-900">
                      {organizer.name}
                    </h3>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    {organizer.address?.city}
                  </p>
                </div>
                {organizer.logo && (
                  <Image
                    className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 object-contain aspect-square"
                    src={organizer.logo}
                    alt={organizer.name}
                    width={50}
                    height={50}
                  />
                )}
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <Link
                      href={`/admin/to/${organizer.id}`}
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      Eventi
                    </Link>
                  </div>
                  <div className="-ml-px flex w-0 flex-1">
                    <Link
                      href={`/admin/to/${organizer.id}/edit`}
                      className="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                    >
                      Modifica
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminIndex;
