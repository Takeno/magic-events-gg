import React from 'react';
import {render, screen} from '@testing-library/react';

import Home from '../../pages/index';

describe('Page /', () => {
  it('should render correctly', () => {
    const tournaments: Tournament[] = [
      {
        id: 'id',
        venue: 'La Torre del Minotauro',
        format: 'modern',
        timestamp: 1642340900271,
      },
    ];

    render(<Home tournaments={tournaments} />);

    expect(
      screen.getByText('Torneo modern - La Torre del Minotauro')
    ).toBeInTheDocument();
  });
});
