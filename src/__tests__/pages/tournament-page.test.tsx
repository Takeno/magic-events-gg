import React from 'react';
import {render, screen} from '@testing-library/react';

import TournamentPage from '../../pages/tournament/[id]';

describe('Page /tournament/[id]', () => {
  it('should render correctly', () => {
    const tournament: Tournament = {
      id: 'id',
      venue: 'La Torre del Minotauro',
      format: 'modern',
      timestamp: 1642340900271,
    };
    render(<TournamentPage tournament={tournament} />);

    expect(screen.getByText('Torneo modern')).toBeInTheDocument();

    expect(
      screen.getByText('Ospitato da La Torre del Minotauro')
    ).toBeInTheDocument();

    expect(screen.getByText('Torna alla lista').closest('a')).toHaveAttribute(
      'href',
      '/'
    );
  });
});
