import EventRow from './EventRow';

type EventRowListProps = {
  title?: string;
  events: Tournament[];
};

export default function EventRowList({events, title}: EventRowListProps) {
  return (
    <>
      {title && <h3 className="text-2xl font-bold uppercase">{title}</h3>}
      <div className="flex flex-col">
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </>
  );
}
