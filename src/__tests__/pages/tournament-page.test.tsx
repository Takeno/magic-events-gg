import React from 'react';
import {render, screen} from '@testing-library/react';

import TournamentPage from '../../pages/tournament/[id]';

describe('Page /tournament/[id]', () => {
  it('should render correctly', () => {
    const tournament: Tournament = {
      id: 'id',
      organizer: {
        name: 'La Torre del Minotauro',
        id: '123',
        logo: null,
      },
      format: 'modern',
      title: null,
      text: null,
      registrationLink: null,
      timestamp: 1642340900271,
      leaguesIds: [],
      leagues: [],
      location: {
        venue: 'La Torre del Minotauro',
        address: 'Via Roma, 100',
        city: 'Roma',
        province: 'RM',
        country: 'Italy',
        latitude: 1,
        longitude: 2,
      },
    };
    render(<TournamentPage tournament={tournament} />);

    expect(screen.getByText('Torneo modern')).toBeInTheDocument();

    expect(screen.getByText('La Torre del Minotauro')).toBeInTheDocument();

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
  });
});
