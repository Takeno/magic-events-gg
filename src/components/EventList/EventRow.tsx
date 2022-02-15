import Image from 'next/image';
import {format} from '../../utils/dates';

import EventBackground from './partials/EventBackground';

type EventRowProps = {
  event: Tournament;
};

export default function EventRow({event}: EventRowProps) {
  return (
    <div className="flex items-center bg-white md:rounded-md overflow-hidden drop-shadow-sm h-[64px] my-2">
      <div className="bg-blue-dark relative h-full w-40 mr-4">
        <EventBackground event={event} />
        {event.organizer.logo && (
          <div className="flex-shrink-0 relative h-14 w-14 rounded-full bg-white flex justify-center items-center top-1 left-1">
            <Image
              className="rounded-full bg-red-600"
              src={event.organizer.logo}
              alt={event.organizer.name}
              objectFit="contain"
              width={50}
              height={50}
            />
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="text-md font-bold text-gray-900 uppercase">
          {event.format} -{' '}
          <span className="text-sm font-normal text-gray-500 normal-case">
            {event.organizer.name}
          </span>
        </div>
        <div className="text-sm font-normal text-gray-500 normal-case">
          Roma (RM), Italy
        </div>
      </div>

      <div className="flex flex-col items-center mr-4">
        <span className="text-sm text-gray-600 first-letter:uppercase">
          {format(event.timestamp, 'E, d MMM')}
        </span>
        <span className="text-md font-bold text-gray-600">
          {format(event.timestamp, 'HH:mm')}
        </span>
      </div>
    </div>
  );
}
