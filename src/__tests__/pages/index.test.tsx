import React from 'react';
import {render, screen} from '@testing-library/react';

import Home from '../../pages/index';

describe('Page /', () => {
  it('should render correctly', async () => {
    const tournaments: Tournament[] = [
      {
        id: 'id',
        organizer: {
          name: 'La Torre del Minotauro',
          id: '123',
          logo: null,
        },
        format: 'modern',
        timestamp: 1642340900271,
        location: {
          venue: 'La Torre del Minotauro',
          address: 'Via Roma, 100',
          city: 'Roma',
          province: 'RM',
          country: 'Italy',
          latitude: 1,
          longitude: 2,
        },
      },
    ];

    render(<Home tournaments={tournaments} />);

    expect(await screen.findAllByText(/Torneo modern/)).toHaveLength(1);

    expect(
      (await screen.findByText(/Torneo modern/)).closest('a')
    ).toHaveAttribute('href', '/tournament/id');
  });
});
