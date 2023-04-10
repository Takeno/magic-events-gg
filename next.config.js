const {withSentryConfig} = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'localhost',
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/https?:\/\//, ''),
    ],
  },
  sentry: {
    disableServerWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
    disableClientWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
  },
  async redirects() {
    return [
      ...Object.entries(oldOrganizers).map(([oldId, newId]) => ({
        source: `/to/${oldId}`,
        destination: `/to/${newId}`,
        permanent: true,
      })),
      ...Object.entries(oldEvents).map(([oldId, newId]) => ({
        source: `/tournament/${oldId}`,
        destination: `/tournament/${newId}`,
        permanent: true,
      })),
    ];
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);

const oldOrganizers = {
  '0IRF1eiWAAygUDl7bWC9': '3457f153-f81d-4382-a25c-3d430f3776e1',
  '1LtRVEA8al2yVWdT2ARP': '419d73ca-f578-4ef1-8847-147892dee791',
  '2K4iNEmaBMx1PGhO1bjL': 'f2b6c29a-3916-47ad-a4e5-95adaa6158bd',
  '2VmyTzsuhFVyB75TYneO': '452fce58-0115-4771-9bd3-6db36104510d',
  '3ts2JbmbxJr4rPYt3J5w': 'd176d2b3-51d4-4514-ae33-0c1e38a81cd4',
  '49I0Bhyx8eBAhsEhftyD': '10d9ff80-2de3-4f38-97a3-811a561aa98d',
  '5J7niLvZ0LCLCCEhGFJ5': '78e99dd0-d672-4626-af34-45ac4df0664c',
  '5ecnlisitPwtUwndPGRA': 'bf6134c9-12fb-4a9e-8697-35e7709dc4dd',
  '5pIsIL3OwNySausAhESf': '95461d94-327c-417d-8b53-9b878d67c2f1',
  '728tirdYrfVZDUt42EWX': 'a4e280fe-0e11-4079-a6eb-b70f4af46680',
  AyReQJMU8fN89LGsdz9G: '1b32cc96-4776-43c6-abbb-8a1f1f0d2848',
  BKUOz1aJkh6iv5Qr5LzK: 'f9d1355c-907f-4a87-9851-9c1bf006aef0',
  C9jnWzjkxnQWGIGERrB4: '709d937c-2c49-410c-8380-2a854b4b998f',
  DKRq8mpWH5m8nml4ojh1: 'adeb3c15-c1b5-483a-909d-1f1546663169',
  EXa5TesBhTQd51tXXLsi: '3de3ff3b-3ddc-4269-833e-c82c29f2c0c4',
  HIprnZOwKxKa0TejGf9u: '75b164f6-ee04-4912-9cb7-ebb23e7cb074',
  HVXfCtZIpt4QfYA0qx7M: '519d93b1-f985-411d-b0ea-e80cd4d0e9dd',
  IVGn8zsyIZ7h0OjAVCO9: '1a19b345-5a51-4eec-a6e8-880496480b91',
  N0oGvNcyIdApvjsOuqmL: 'e87aed89-be69-4327-bac4-b9daf53824cc',
  NkoKKuPemy2sNK43DWFb: '339bf80b-b931-4764-b672-49b8d1798211',
  OaVoI8nJLaG1GZ55N4Ad: '9f8e46e8-93eb-4737-bc0c-c91cf0ad261a',
  PjiiWKdfv4nCilHdbaRl: '88786e87-867e-44f0-953b-e39450f921e4',
  PzoG1IsVo7VpTVblQoqC: 'ccb74690-882c-4b0e-b1f7-398446da6e84',
  R5n5Gg2NQ8JSbcQh0yZv: '991801b3-0a5c-41c9-bfdb-e8ff94b3f475',
  SczjGpZNH5AhUKOqdJu3: '9af66d75-f978-4044-9971-86f9caeebbd3',
  T3lJyY5TrAc4iPIqkuka: 'be675375-93ea-41b8-bf75-8953598b77e7',
  T8jD358OmHWT4KYKERFz: 'e3009421-9dd3-47b8-994d-ddbd4e4a5dd8',
  TxVnQlFx8pbnLKI13H3i: 'ece3ee6a-b898-4f66-b798-bf5ae456343d',
  W1Q383b3Jfqh8O6D0OsQ: '8d3c90b5-93ac-478d-9b5c-309cf2c25676',
  WA48XUq6cFsoZzemMm6i: '88bb70c6-c424-4199-ba4d-ea5bd851efcb',
  WBcxMSJjApk0HUHbCZyp: '19b2f26d-acce-4302-a457-e0ded245a7ea',
  XZbrNhyE4bM8q5Qmr4FT: '44eccbde-3cf7-4000-a0a0-fcde80c8c45d',
  XkRHFK20Ds9oucxm9A4g: '0f1de76a-dc94-46ed-ba43-e8b0b88ea79e',
  ZipW8Fcb6oP2Bmty49WW: 'a12d6b9c-f0c7-4b5c-af4c-cc83546fbcf5',
  cMIqXblNRMFiAYVXTQwD: 'f308a74b-496a-4a9f-944e-69cc90f471b1',
  dKM2ZBeWuRmiNMQkHCCn: 'ee419c60-5c84-4125-8f18-33956fc7a604',
  dhbZoIj9D98Dg6btNaJ2: 'c48339b8-e82f-4714-ba4e-836dd3dc3bf3',
  eMEnbMPbde7rFhMZApf8: '048f7d21-34fb-4e49-91a7-7a7058fc1bc6',
  gXtJGmhnRWNV0l3yBpdJ: '0afbafa1-2a18-4b96-8ac6-42af0e17a96a',
  hZ58KZFnGDryKykxDkNY: '2a6eb2a7-e47e-4216-b11d-0d76c0d298af',
  hulH9FjXUE7h20fbqRky: 'ce4d0f44-d078-47a8-b6e7-f4da2bcf8ec0',
  iDu4l0R1EupmkH26rzkS: 'c6725406-89d0-4218-819c-e76f3976dd03',
  inn2WaVFRaZnHfeXX2la: 'ef7c93f9-275c-4df0-8a5b-312cfd8a23e8',
  jMXSMcciTzQM5koKrBWr: '33e1d040-7cc3-45df-ace4-85138fbb2c26',
  jYHZVpQ4TiaQfdjc8t1e: '660512be-1c59-4fbc-8a10-69506bd6045d',
  k3CzauYz9Omdpng2cNtZ: '505d4a65-cb78-4001-99b3-c5a021f8da9c',
  k6fRgj4AHkIBStoEB27H: 'f37a0daf-f0be-4e59-9b83-a5cd87257e08',
  kEpHdNFfXEKPI3DO3VfM: 'a90a4cab-0f03-439e-baa6-26b7e7398dd2',
  kvmmWcL25WMPBCIHZ262: '5abd0c7e-d76e-4969-b9c1-e598fd9f6422',
  lGcfbKTDa8XsySSd6IUJ: '11b23b4b-d461-40ad-a1bb-a786a8b859cc',
  likt3tF3I3ic89JYoLa8: '0c1b8c1e-f547-4ecd-9424-37e841f74698',
  mQVvC6KB6PYPBDfdgcal: '27fb94d9-c027-48ec-b310-02f111653702',
  nOajHA11vaGtr4A5PTDd: '16dec368-c551-48bc-a09d-16446e7aeaf8',
  nSp8rsbahur3MDZqx0mp: 'a66aa9e4-e884-405b-9f94-27aaee17a6a4',
  netjO6azl3zT5wsBRv8Y: '03f320d7-88b8-4655-80d1-308e26f0e460',
  ovUO1GXoeMh7NH5E2CY9: 'edd707f3-e612-4166-954a-471e4fba3bdf',
  ppx1Bpeuyau8YqvxIS27: 'c3d0cb24-d9d0-4959-92c7-9981b9593502',
  taIkSAEg9xHFQWS3ctvW: 'fab53686-ba4e-4d77-8df9-d3c94363e8d3',
  w8q1zHNn7I5rLAYeOFRz: '215d4bb2-9f79-45e0-a04b-49633b4597bf',
  wSDmEAqkDKPgl9WnX3NL: '8700d4ee-5f8a-42c7-8d06-3cdb8ae743af',
  ytDd0PoCCvL1KFqW2A4m: 'b27c8da4-f72e-44d0-a01b-b1ddde387758',
};

const oldEvents = {
  1223273328552637: '07951138-d8f3-4a16-9fce-2aa7bf912d38',
  1253098082269226: 'cb28d44d-5650-472b-af44-dbec08f8ec39',
  1527735637730827: '79fae066-a36d-4143-ba09-2404708fb52e',
  187947973944941: '31b63173-62b5-4f39-b8db-eb1172f20b6a',
  '1jgwKlVPDetpWnqpSag0': '924a42a1-56b4-4688-99fd-d419a3ac69f1',
  2433012830199544: 'e4f8683f-e7ab-4a96-95d8-dc6b9b5a698d',
  '3qdeYzlMuRpI8v1xbOS3': '43ca7716-2465-4514-a71d-7723d4efd269',
  '483NQUjZODYSZX3IDwPC': '3f93e131-3abf-4c82-9c6d-902a08d4ef30',
  579853434185480: '5b66de33-7e7a-4ec1-a6b8-0cc577c23aee',
  6711618778872301: 'b9eddef4-609c-4985-872f-1b853e9cf68a',
  776378874060417: '73489981-4663-49a6-bbc8-df5048dadcf2',
  945166553344905: '716f1181-b8d5-4a76-87ea-af64fd8a4489',
  952779092545586: 'a6702fc8-46bb-4123-b721-4fc555ba1052',
  991024268532105: 'e5292225-17a2-4d4b-8ddf-d827f0539bb9',
  A8UiDKcHTUKTGXtZ6hBb: 'f7cb3c64-a7be-4fad-b893-1825f968c676',
  BIEREKNvFjNa7LAofRVR: 'ea9db977-8c0e-4b83-9882-61a1ac185af9',
  Db57Fv8ssu0xv41wonnW: '36e4d0be-594f-4efb-a288-7656f371870d',
  F3F909o2AJRq2Wim78eb: '0b017875-31e6-4874-9c46-87c7b0e9722d',
  RYmSfQbchoeUYzB1Fp0R: 'cf3917c2-3934-43ae-b625-905b1157ab38',
  S5YrTP7D1ttqp7QUbKKX: '3eb69a8b-9e72-4c9d-adfc-b6c0ba0a7c92',
  WxeJaCxqcN1kJys9ch8T: '7c63d1cf-6f75-4d5f-96d2-98a6a266d457',
  hZIqewwhWpBOAXAaKB13: '81d9cd79-a397-42a9-87b7-82214dfbf527',
  kSKuYnL5aUFR6runlF0z: 'aee2b557-b3e5-4fc6-a294-b30d0566729d',
  nJeLQMJnVnWYpTyET0dO: '6ad23692-365f-4cfc-8bdd-9573b8333e75',
  nWd9ji2f74LC5wWbmiNr: '31fcfa9c-fc6b-4597-9d5b-20cf95d90169',
  ulsFp5jvdjyzb2R37das: '5763aace-1c84-44be-bd56-e234322c3512',
  vT4jA2LP5SliHjj7nbpy: '6793c365-9643-45ed-a9c6-b3222b20926b',
  wSXbVNd5QjyCjdwo17PQ: 'a2761d37-ac51-4155-93dc-f71de32a028a',
  zIUjnS6OEP5B84WUboHp: '186defd8-582f-4abe-84a7-018164f613e0',
};
