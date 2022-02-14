const add = require('date-fns/add');
const sub = require('date-fns/sub');
const set = require('date-fns/set');

const TOURNAMENT_ORGANIZERS = [
  {
    id: 'to-01',
    name: 'La Mia Fumetteria',
    address: 'Via Roma, 100',
    city: 'Roma (RM), Italy',
    location: [41.89591311534382, 12.482574089058868],
  },
  {
    id: 'to-02',
    name: 'Carte Che Passione',
    address: 'Via Roma, 100',
    city: 'Torino (TO), Italy',
    location: [45.07119418846577, 7.686011907682986],
  },
  {
    id: 'to-03',
    name: 'Negozio 01',
    address: 'Via Roma, 100',
    city: 'Roma (RM), Italy',
    location: [41.87663604952337, 12.481060499636694],
  },
];

const USERS = [
  {
    id: 'lU1mG4MXPYPgoXgbTBX0ekP4Ldk1',
    email: 'test@test.it',
    roles: ['ROLE_USER', 'ROLE_ADMIN'],
    storeManagerOf: [TOURNAMENT_ORGANIZERS[0].id],
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
    location: TOURNAMENT_ORGANIZERS[0].location,
    venue: TOURNAMENT_ORGANIZERS[0].name,
    organizer: {
      id: TOURNAMENT_ORGANIZERS[0].id,
      name: TOURNAMENT_ORGANIZERS[0].name,
    },
  },
  {
    id: 'tournament-02',
    datetime: add(set(new Date(), {hours: 21, minutes: 30}), {days: 6}),
    format: 'modern',
    location: TOURNAMENT_ORGANIZERS[0].location,
    venue: TOURNAMENT_ORGANIZERS[0].name,
    organizer: {
      id: TOURNAMENT_ORGANIZERS[0].id,
      name: TOURNAMENT_ORGANIZERS[0].name,
    },
  },
  {
    id: 'tournament-03',
    datetime: add(set(new Date(), {hours: 21, minutes: 0}), {days: 7}),
    format: 'modern',
    location: TOURNAMENT_ORGANIZERS[1].location,
    venue: TOURNAMENT_ORGANIZERS[1].name,
    organizer: {
      id: TOURNAMENT_ORGANIZERS[1].id,
      name: TOURNAMENT_ORGANIZERS[1].name,
    },
  },
  {
    id: 'tournament-04',
    datetime: add(set(new Date(), {hours: 21, minutes: 30}), {days: 1}),
    format: 'pauper',
    location: TOURNAMENT_ORGANIZERS[2].location,
    venue: TOURNAMENT_ORGANIZERS[2].name,
    organizer: {
      id: TOURNAMENT_ORGANIZERS[2].id,
      name: TOURNAMENT_ORGANIZERS[2].name,
    },
  },
  {
    id: 'tournament-05',
    datetime: sub(set(new Date(), {hours: 21, minutes: 0}), {days: 1}),
    format: 'legacy',
    location: TOURNAMENT_ORGANIZERS[2].location,
    venue: TOURNAMENT_ORGANIZERS[2].name,
    organizer: {
      id: TOURNAMENT_ORGANIZERS[2].id,
      name: TOURNAMENT_ORGANIZERS[2].name,
    },
  },
];

module.exports = {
  USERS,
  TOURNAMENTS,
  TOURNAMENT_ORGANIZERS,
};
