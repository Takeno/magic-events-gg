export default function Footer() {
  return (
    <footer className="bg-blue-dark mt-8 px-4 py-6">
      <div className="container text-white h-full mx-auto">
        <p className="text-md text-center my-4">
          Developed with ❤️ by @takeno, mainly on{' '}
          <a
            className="text-primary underline"
            href="https://www.twitch.tv/takenodev"
          >
            Twitch
          </a>{' '}
          -{' '}
          <a
            className="text-primary underline"
            href="https://github.com/Takeno/magic-events-gg/"
          >
            Github Repo
          </a>
        </p>
        <p className="text-[12px] text-center">
          Wizards of the Coast, Magic: The Gathering, and their logos are
          trademarks of Wizards of the Coast LLC. All rights reserved.
          Magic-events.gg is not affiliated with Wizards of the Coast LLC.
        </p>
      </div>
    </footer>
  );
}
