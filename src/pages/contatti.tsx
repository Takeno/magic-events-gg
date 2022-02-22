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
          MagicEvents.gg è il primo aggregatore di eventi e tornei di Magic sul
          territorio studiato per rispondere una volta per tutte alla domanda
          &quot;dove gioco il mio formato preferito questa sera in questa
          città?&quot;
        </p>

        <p className="mt-2">
          L&apos;obiettivo è riuscire ad avvicinare tutti i giocatori, anche i
          più casual, agli eventi sul territorio (perché Arena è bello, ma
          tirare bolt in faccia all&apos;avversario ha tutto un altro sapore).
        </p>
        <p className="mt-2">
          Abbiamo in programma tantissime funzionalità dedicate ai giocatori e
          ai negozianti, e siamo aperti a feedback e suggerimenti per far
          diventare la piattaforma un punto d&apos;incontro tra giocatori ed
          organizzatori.
        </p>
        <p className="mt-2">Stay safe, wear a mask and play magic!</p>

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
