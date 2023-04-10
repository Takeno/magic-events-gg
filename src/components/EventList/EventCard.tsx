import Link from 'next/link';
import Image from 'next/image';
import {formatTimeZoned} from '../../utils/dates';
import EventBackground from './partials/EventBackground';

type EventCardProps = {
  event: Tournament;
};

export default function EventCard({event}: EventCardProps) {
  return (
    <div className="bg-white md:rounded-md drop-shadow-sm h-fit">
      <div className="h-32 bg-blue-dark relative">
        <EventBackground event={event} />
        {event.organizer.logo && (
          <div className="flex-shrink-0 relative h-14 w-14 rounded-full bg-white flex justify-center items-center top-4 left-4">
            <Image
              className="rounded-full object-contain aspect-square"
              src={event.organizer.logo}
              alt={event.organizer.name}
              width={50}
              height={50}
            />
          </div>
        )}
      </div>

      <div className="flex flex-row justify-between px-4 my-2">
        <span className="text-sm text-gray-600 first-letter:uppercase">
          {formatTimeZoned(event.startDate, event.startDateTz, 'E, d MMM')}
        </span>
        <span className="text-sm text-gray-600">
          {formatTimeZoned(event.startDate, event.startDateTz, 'HH:mm')}
        </span>
      </div>

      <div className="flex flex-row justify-between px-4 my-2">
        <Link
          href={`/tournament/${event.id}`}
          className="text-lg font-bold uppercase truncate"
          title={`Torneo ${event.format} di ${event.organizer.name}`}
        >
          {event.title || `Torneo ${event.format}`}
        </Link>
      </div>

      <div className="px-4 my-2 truncate">
        <Link href={`/to/${event.organizer.id}`}>{event.organizer.name}</Link>
        {event.onlineEvent || (
          <div className="text-sm font-normal text-gray-500 normal-case">
            {event.location.city} ({event.location.province}),{' '}
            {event.location.country}
          </div>
        )}
      </div>
    </div>
  );
}
