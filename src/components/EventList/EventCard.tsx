import Link from 'next/link';
import Image from 'next/image';
import {format} from '../../utils/dates';
import EventBackground from './partials/EventBackground';

import store from '../../assets/store.png';

type EventCardProps = {
  event: Tournament;
};

export default function EventCard({event}: EventCardProps) {
  return (
    <div className="bg-white md:rounded-md drop-shadow-sm h-fit">
      <div className="h-32 bg-blue-dark relative">
        <EventBackground event={event} />
        <div className="flex-shrink-0 relative h-14 w-14 rounded-full bg-white flex justify-center items-center top-4 left-4">
          <Image
            className="h-10 w-10 rounded-full"
            src={store}
            alt={event.organizer.name}
            objectFit="contain"
          />
        </div>
      </div>

      <div className="flex flex-row justify-between px-4 my-2">
        <span className="text-sm text-gray-600 first-letter:uppercase">
          {format(event.timestamp, 'E, d MMM')}
        </span>
        <span className="text-sm text-gray-600">
          {format(event.timestamp, 'HH:mm')}
        </span>
      </div>

      <div className="flex flex-row justify-between px-4 my-2">
        <Link href={`/tournament/${event.id}`}>
          <a className="text-xl font-bold uppercase">Torneo {event.format}</a>
        </Link>
      </div>

      <div className="px-4 my-2">
        <Link href={`/to/${event.organizer.id}`}>
          <a>{event.organizer.name}</a>
        </Link>
        <div className="text-sm font-normal text-gray-500 normal-case">
          Roma (RM), Italy
        </div>
      </div>
    </div>
  );
}
