/** * @jest-environment node */
// We need "@jest-environment node" because with jsdom firebase-admin will not works as expected
import {
  fetchEventByCoords,
  fetchAllEvents,
  fetchOrganizerManagedBy,
  fetchAllEventsByOrganizer,
  saveNewEvent,
} from '../../utils/firebase-server';
import {resetDb, populateDb} from '../../fixtures/index';
import {TOURNAMENTS, TOURNAMENT_ORGANIZERS, USERS} from '../../fixtures/data';

describe('firebase.ts - fetchAllEvents', () => {
  beforeAll(async () => {
    await resetDb();
    await populateDb();
  });

  it('should returns 3 tournaments', async () => {
    const results = await fetchAllEvents();

    expect(results).toHaveLength(5);
  });
});

describe('firebase.ts - fetchEventByCoords', () => {
  beforeAll(async () => {
    await resetDb();
    await populateDb();
  });

  it('should return empty results with New York coords', async () => {
    const results = await fetchEventByCoords(
      40.75117460379347,
      -73.98626368260958
    );

    expect(results).toHaveLength(0);
  });

  it('should return two tournaments in Rome with Colosseum coords', async () => {
    const results = await fetchEventByCoords(
      41.8905227376549,
      12.492389585053866
    );

    expect(results).toHaveLength(4);

    expect(results.find((t) => t.id === 'tournament-01')).not.toBeUndefined();
  });

  it('should return two tournaments in Rome with Nuvola coords only with distance 30km', async () => {
    const results1 = await fetchEventByCoords(
      41.83105130618335,
      12.472282751245674
    );

    expect(results1).toHaveLength(0);

    const results2 = await fetchEventByCoords(
      41.83105130618335,
      12.472282751245674,
      30
    );

    expect(results2).toHaveLength(4);

    expect(results2.find((t) => t.id === 'tournament-01')).not.toBeUndefined();
  });

  it('should return one tournament in Turin with Mole coords', async () => {
    const results = await fetchEventByCoords(
      45.069117381949745,
      7.693200106643909
    );

    expect(results).toHaveLength(1);

    expect(results.find((t) => t.id === 'tournament-03')).not.toBeUndefined();
  });
});

describe('firebase.ts - fetchOrganizerManagedBy', () => {
  beforeAll(async () => {
    await resetDb();
    await populateDb();
  });

  it('should throw exception for unknown user', async () => {
    const p = fetchOrganizerManagedBy('abc');

    await expect(p).rejects.toBeInstanceOf(Error);
  });

  it('should throw exception for non-admin user', async () => {
    const p = fetchOrganizerManagedBy(USERS[1].id);

    await expect(p).rejects.toBeInstanceOf(Error);
  });

  it('should return 1 result for admin 01', async () => {
    const results = await fetchOrganizerManagedBy(USERS[0].id);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(TOURNAMENT_ORGANIZERS[0].id);
  });
});

describe('firebase.ts - fetchAllEventsByOrganizer', () => {
  beforeAll(async () => {
    await resetDb();
    await populateDb();
  });

  it('should return 1 result for admin 01', async () => {
    const results = await fetchAllEventsByOrganizer(
      TOURNAMENT_ORGANIZERS[0].id
    );

    expect(results).toHaveLength(2);
    expect(results[0].id).toBe(TOURNAMENTS[0].id);
  });

  it('should return 0 results for unknown organizer', async () => {
    const results = await fetchAllEventsByOrganizer('abc');

    expect(results).toHaveLength(0);
  });
});

describe('firebase.ts - saveNewEvent', () => {
  beforeAll(async () => {
    await resetDb();
    await populateDb();
  });

  it('should save new event', async () => {
    const before = await fetchAllEventsByOrganizer(TOURNAMENT_ORGANIZERS[0].id);

    expect(before).toHaveLength(2);

    await saveNewEvent(TOURNAMENT_ORGANIZERS[0].id, {
      format: 'modern',
      timestamp: Date.now(),
      title: null,
      text: null,
    });

    const after = await fetchAllEventsByOrganizer(TOURNAMENT_ORGANIZERS[0].id);

    expect(after).toHaveLength(3);
  });
});
