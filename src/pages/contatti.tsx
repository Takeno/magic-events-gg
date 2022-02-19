import Breadcrumb from '../components/Breadcrumb';

export default function Contatti() {
  return (
    <>
      <Breadcrumb
        items={[
          {
            text: 'Contatti',
          },
        ]}
      />
      <article className="max-w-screen-md mx-auto mt-4">
        <h1 className="text-3xl font-bold">Contatti</h1>

        <p className="mt-2">
          MagicEvents.gg nasce da un&apos;idea di Matteo Manchi, sviluppato con
          tecnologie open source e pubblicato su{' '}
          <a
            className="underline"
            href="https://github.com/Takeno/magic-events-gg/"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
          .
        </p>

        <h2 className="text-xl font-bold mt-8">Organizzi tornei di Magic?</h2>
        <p className="mt-2">
          Stiamo sviluppando nuove funzionalità dedicate agli organizzatori di
          eventi e negozi di Magic. Se vuoi promuovere i tuoi eventi e la tua
          attività sul sito, contattaci{' '}
          <a
            href="https://forms.gle/1JGC4VXh27uTqiDAA"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            cliccando qui
          </a>
          .
        </p>

        <h2 className="text-xl font-bold mt-8">Feedback</h2>
        <p className="mt-2">
          La piattaforma è in continuo sviluppo e miglioramento. Se hai
          riscontrato un problema, hai un suggerimento o semplicemente vuoi
          ringraziarci, puoi inviarci un messaggio{' '}
          <a
            href="https://forms.gle/J1ChYbfGnJaZm8xw9"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            cliccando qui
          </a>
          .
        </p>
      </article>
    </>
  );
}
