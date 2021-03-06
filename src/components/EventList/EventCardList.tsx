import EventCard from './EventCard';

type EventListProps = {
  events: Tournament[];
};

export default function EventCardList({events}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-justify text-blue-dark space-y-4 px-4">
        <h3 className="text-4xl font-bold text-center">:(</h3>
        <h3 className="text-3xl font-bold">
          Attualmente non abbiamo tornei di questo tipo e/o in questa città da
          consigliarti.
        </h3>
        <p className="text-lg">
          La nostra raccolta di eventi e tornei è in continuo aumento e stiamo
          coinvolgendo sempre più organizzatori e negozianti.
        </p>
        <p className="text-lg">
          Se conosci qualche organizzatore o negozio che organizza tornei di
          Magic, puoi segnalarcelo tramite{' '}
          <a
            href="https://forms.gle/J1ChYbfGnJaZm8xw9"
            target="_blank"
            rel="noreferrer"
            className="underline font-semibold"
          >
            questo modulo
          </a>
          . Cercheremo di portarlo a bordo nel più breve tempo possibile, così
          da offrire un sempre più vasto numero di appuntamenti sul territorio.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 px-1 ">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div className="text-justify text-blue-dark space-y-4 px-4 mt-10">
        <h3 className="text-xl font-bold">Manca qualche torneo?</h3>
        <p className="text-lg">
          La nostra raccolta di eventi e tornei è in continuo aumento e stiamo
          coinvolgendo sempre più organizzatori e negozianti.
        </p>
        <p className="text-lg">
          Se conosci qualche organizzatore o negozio che organizza tornei di
          Magic, puoi segnalarcelo tramite{' '}
          <a
            href="https://forms.gle/J1ChYbfGnJaZm8xw9"
            target="_blank"
            rel="noreferrer"
            className="underline font-semibold"
          >
            questo modulo
          </a>
          . Cercheremo di portarlo a bordo nel più breve tempo possibile, così
          da offrire un sempre più vasto numero di appuntamenti sul territorio.
        </p>
      </div>
    </>
  );
}
