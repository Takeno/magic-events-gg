const TOURNAMENT_ORGANIZERS = [
  {
    id: 'to-01',
    name: 'La Mia Fumetteria',
    location: [41.89591311534382, 12.482574089058868],
  },
  {
    id: 'to-02',
    name: 'Carte Che Passione',
    location: [45.07119418846577, 7.686011907682986],
  },
];

const TOURNAMENTS = [
  {
    id: 'tournament-01',
    datetime: new Date('2022-02-10 10:30:00'),
    format: 'modern',
    location: TOURNAMENT_ORGANIZERS[0].location,
    venue: TOURNAMENT_ORGANIZERS[0].name,
  },
  {
    id: 'tournament-02',
    datetime: new Date('2022-02-18 10:30:00'),
    format: 'modern',
    location: TOURNAMENT_ORGANIZERS[0].location,
    venue: TOURNAMENT_ORGANIZERS[0].name,
  },
  {
    id: 'tournament-03',
    datetime: new Date('2022-02-18 10:30:00'),
    format: 'modern',
    location: TOURNAMENT_ORGANIZERS[1].location,
    venue: TOURNAMENT_ORGANIZERS[1].name,
  },
];

module.exports = {
  TOURNAMENTS,
  TOURNAMENT_ORGANIZERS,
};
