const add = require('date-fns/add');
const sub = require('date-fns/sub');
const set = require('date-fns/set');

const TOURNAMENT_ORGANIZERS = [
  {
    id: 'to-01',
    name: 'La Mia Fumetteria',
    logo: 'https://firebasestorage.googleapis.com/v0/b/magic-events-gg.appspot.com/o/organizers%2Fstore.png?alt=media',
    location: {
      address: 'Via Roma, 100',
      city: 'Roma',
      province: 'RM',
      country: 'Italy',
      latitude: 41.89591311534382,
      longitude: 12.482574089058868,
    },
  },
  {
    id: 'to-02',
    name: 'Carte Che Passione',
    logo: 'https://firebasestorage.googleapis.com/v0/b/magic-events-gg.appspot.com/o/organizers%2Fstore.png?alt=media',
    location: {
      address: 'Via Roma, 100',
      city: 'Torino',
      province: 'TO',
      country: 'Italy',
      latitude: 45.07119418846577,
      longitude: 7.686011907682986,
    },
  },
  {
    id: 'to-03',
    name: 'Negozio 01',
    logo: 'https://firebasestorage.googleapis.com/v0/b/magic-events-gg.appspot.com/o/organizers%2Fstore.png?alt=media',
    location: {
      address: 'Via Roma, 100',
      city: 'Roma',
      province: 'RM',
      country: 'Italy',
      latitude: 41.87663604952337,
      longitude: 12.481060499636694,
    },
  },
  {
    id: 'to-online',
    name: 'Online Organizer',
    logo: 'https://firebasestorage.googleapis.com/v0/b/magic-events-gg.appspot.com/o/organizers%2Fstore.png?alt=media',
    location: null,
  },
];

const LEAGUES = [
  {
    id: 'league-01',
    name: 'Centurion Commander',
    logo: 'https://firebasestorage.googleapis.com/v0/b/magic-events-gg.appspot.com/o/leagues%2Fcenturion-commander.jpg?alt=media',
  },
];

const USERS = [
  {
    id: 'lU1mG4MXPYPgoXgbTBX0ekP4Ldk1',
    email: 'test@test.it',
    roles: ['ROLE_USER', 'ROLE_ADMIN'],
    storeManagerOf: [TOURNAMENT_ORGANIZERS[0].id, TOURNAMENT_ORGANIZERS[3].id],
    leagueManagerOf: [LEAGUES[0].id],
  },
  {
    id: 'lU1mG4MXPYPgoXgbTBX0ekP4Ldk2',
    email: 'test@test.it',
    roles: ['ROLE_USER'],
  },
];

const TOURNAMENTS = [
  {
    id: 'tournament-01',
    datetime: add(set(new Date(), {hours: 21, minutes: 0}), {days: 7}),
    format: 'modern',
    location: {
      venue: TOURNAMENT_ORGANIZERS[0].name,
      ...TOURNAMENT_ORGANIZERS[0].location,
    },
    organizer: {
      id: TOURNAMENT_ORGANIZERS[0].id,
      name: TOURNAMENT_ORGANIZERS[0].name,
      logo: TOURNAMENT_ORGANIZERS[0].logo,
    },
  },
  {
    id: 'tournament-02',
    datetime: add(set(new Date(), {hours: 21, minutes: 30}), {days: 6}),
    format: 'centurion',
    location: {
      venue: TOURNAMENT_ORGANIZERS[0].name,
      ...TOURNAMENT_ORGANIZERS[0].location,
    },
    organizer: {
      id: TOURNAMENT_ORGANIZERS[0].id,
      name: TOURNAMENT_ORGANIZERS[0].name,
      logo: TOURNAMENT_ORGANIZERS[0].logo,
    },
    leagues: [
      {
        id: LEAGUES[0].id,
        name: LEAGUES[0].name,
        logo: LEAGUES[0].logo,
      },
    ],
  },
  {
    id: 'tournament-03',
    datetime: add(set(new Date(), {hours: 21, minutes: 0}), {days: 7}),
    format: 'modern',
    location: {
      venue: TOURNAMENT_ORGANIZERS[1].name,
      ...TOURNAMENT_ORGANIZERS[1].location,
    },
    organizer: {
      id: TOURNAMENT_ORGANIZERS[1].id,
      name: TOURNAMENT_ORGANIZERS[1].name,
      logo: TOURNAMENT_ORGANIZERS[1].logo,
    },
  },
  {
    id: 'tournament-04',
    datetime: add(set(new Date(), {hours: 21, minutes: 30}), {days: 1}),
    format: 'pauper',
    location: {
      venue: TOURNAMENT_ORGANIZERS[2].name,
      ...TOURNAMENT_ORGANIZERS[2].location,
    },
    organizer: {
      id: TOURNAMENT_ORGANIZERS[2].id,
      name: TOURNAMENT_ORGANIZERS[2].name,
      logo: TOURNAMENT_ORGANIZERS[2].logo,
    },
  },
  {
    id: 'tournament-05',
    datetime: sub(set(new Date(), {hours: 21, minutes: 0}), {days: 1}),
    format: 'legacy',
    title: 'Legacy League',
    location: {
      venue: TOURNAMENT_ORGANIZERS[2].name,
      ...TOURNAMENT_ORGANIZERS[2].location,
    },
    organizer: {
      id: TOURNAMENT_ORGANIZERS[2].id,
      name: TOURNAMENT_ORGANIZERS[2].name,
      logo: TOURNAMENT_ORGANIZERS[2].logo,
    },
  },
  {
    id: 'tournament-06',
    datetime: add(set(new Date(), {hours: 21, minutes: 30}), {days: 1}),
    format: 'legacy',
    title: 'Legacy da TO Online',
    location: {
      venue: 'Locale fittizio',
      address: 'Via Roma, 100',
      city: 'Roma',
      province: 'RM',
      country: 'Italy',
      latitude: 41.87663604952337,
      longitude: 12.481060499636694,
    },
    organizer: {
      id: TOURNAMENT_ORGANIZERS[3].id,
      name: TOURNAMENT_ORGANIZERS[3].name,
      logo: TOURNAMENT_ORGANIZERS[3].logo,
    },
  },
];

module.exports = {
  USERS,
  TOURNAMENTS,
  TOURNAMENT_ORGANIZERS,
  LEAGUES,
};
