import EventCard from './EventCard';

type EventListProps = {
  events: Tournament[];
};

export default function EventCardList({events}: EventListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-1 ">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
