import {initializeApp, getApps, cert} from 'firebase-admin/app';
import {getFirestore, Timestamp, FieldPath} from 'firebase-admin/firestore';
import {getAuth as getFirebaseAuth} from 'firebase-admin/auth';
import * as geofire from 'geofire-common';
import {isAdmin} from './acl';

function init() {
  if (process.env.GSERVICE_ACCOUNT_SECRETS) {
    const serviceAccount = JSON.parse(process.env.GSERVICE_ACCOUNT_SECRETS);

    initializeApp({
      credential: cert(serviceAccount),
    });
    return;
  }

  initializeApp({
    projectId: process.env.FIRESTORE_PROJECT_ID!,
  });
}

function getDatabase() {
  if (getApps().length === 0) {
    init();
  }

  return getFirestore();
}

function getAuth() {
  if (getApps().length === 0) {
    init();
  }

  return getFirebaseAuth();
}

export async function fetchHomeEvents(): Promise<Tournament[]> {
  const db = getDatabase();

  const snapshot = await db
    .collection('tournaments')
    .where('timestamp', '>=', Timestamp.fromDate(new Date()))
    .orderBy('timestamp', 'asc')
    .get();

  const data: Tournament[] = [];

  snapshot.forEach((doc: any) => {
    const d = doc.data();

    data.push({
      id: doc.id,
      format: d.format,
      title: d.title || null,
      text: d.text || null,
      registrationLink: d.registrationLink || null,
      timestamp: d.timestamp.seconds * 1000,
      location: {
        venue: d.location.venue,
        address: d.location.address,
        city: d.location.city,
        province: d.location.province,
        country: d.location.country,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
      },
      organizer: {
        id: d.organizer.id,
        name: d.organizer.name,
        logo: d.organizer.logo || null,
      },
      leaguesIds: d.leaguesIds || [] || [],
      leagues: (d.leagues || []).map((l: any) => ({
        id: l.id,
        name: l.name,
        logo: l.logo || null,
      })),
    });
  });

  return data;
}

export async function fetchAllEvents(): Promise<Tournament[]> {
  const db = getDatabase();

  const snapshot = await db.collection('tournaments').get();

  const data: Tournament[] = [];

  snapshot.forEach((doc: any) => {
    const d = doc.data();

    data.push({
      id: doc.id,
      format: d.format,
      title: d.title || null,
      text: d.text || null,
      registrationLink: d.registrationLink || null,
      timestamp: d.timestamp.seconds * 1000,
      location: {
        venue: d.location.venue,
        address: d.location.address,
        city: d.location.city,
        province: d.location.province,
        country: d.location.country,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
      },
      organizer: {
        id: d.organizer.id,
        name: d.organizer.name,
        logo: d.organizer.logo || null,
      },
      leaguesIds: d.leaguesIds || [],
      leagues: (d.leagues || []).map((l: any) => ({
        id: l.id,
        name: l.name,
        logo: l.logo || null,
      })),
    });
  });

  return data;
}

export async function fetchEventById(id: string): Promise<Tournament | null> {
  const db = getDatabase();

  const snapshot = await db.collection('tournaments').doc(id).get();

  const d = snapshot.data();

  if (snapshot.exists === false || d === undefined) {
    return null;
  }

  const tournament: Tournament = {
    id: snapshot.id,
    format: d.format,
    title: d.title || null,
    text: d.text || null,
    registrationLink: d.registrationLink || null,
    timestamp: d.timestamp.seconds * 1000,
    location: {
      venue: d.location.venue,
      address: d.location.address,
      city: d.location.city,
      province: d.location.province,
      country: d.location.country,
      latitude: d.location.latitude,
      longitude: d.location.longitude,
    },
    organizer: {
      id: d.organizer.id,
      name: d.organizer.name,
      logo: d.organizer.logo || null,
    },
    leaguesIds: d.leaguesIds || [],
    leagues: (d.leagues || []).map((l: any) => ({
      id: l.id,
      name: l.name,
      logo: l.logo || null,
    })),
  };

  return tournament;
}

export async function fetchOrganizerById(
  id: string
): Promise<Organizer | null> {
  const db = getDatabase();

  const snapshot = await db.collection('organizers').doc(id).get();

  const d = snapshot.data();

  if (snapshot.exists === false || d === undefined) {
    return null;
  }

  const organizer: Organizer = {
    id: snapshot.id,
    name: d.name,
    description: d.description || null,
    logo: d.logo || null,
    facebook: d.facebook || null,
    email: d.email || null,
    whatsapp: d.whatsapp || null,
    website: d.website || null,
    discord: d.discord || null,
    location: d.location && {
      address: d.location.address,
      city: d.location.city,
      province: d.location.province,
      country: d.location.country,
      latitude: d.location.latitude,
      longitude: d.location.longitude,
    },
  };

  return organizer;
}

export async function fetchEventByCoords(
  lat: number,
  lng: number,
  radius: number = 5
): Promise<Tournament[]> {
  const db = getDatabase();

  const center = [lat, lng];
  const radiusMeters = radius * 1000;

  const bounds = geofire.geohashQueryBounds(center, radiusMeters);

  const promises = [];
  for (const b of bounds) {
    const q = db
      .collection('tournaments')
      .orderBy('geohash')
      .startAt(b[0])
      .endAt(b[1]);

    promises.push(q.get());
  }

  console.log('QUERY BY COORDS: %d', promises.length);

  const snapshots = await Promise.all(promises);
  const matchingDocs: Tournament[] = [];

  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const location = doc.get('location');

      // We have to filter out a few false positives due to GeoHash
      // accuracy, but most will match
      const distanceInKm = geofire.distanceBetween(
        [location.latitude, location.longitude],
        center
      );

      if (distanceInKm <= radius) {
        const d = doc.data();

        matchingDocs.push({
          id: doc.id,
          format: d.format,
          title: d.title || null,
          text: d.text || null,
          registrationLink: d.registrationLink || null,
          timestamp: d.timestamp.seconds * 1000,
          location: {
            venue: d.location.venue,
            address: d.location.address,
            city: d.location.city,
            province: d.location.province,
            country: d.location.country,
            latitude: d.location.latitude,
            longitude: d.location.longitude,
          },
          organizer: {
            id: d.organizer.id,
            name: d.organizer.name,
            logo: d.organizer.logo || null,
          },
          leaguesIds: d.leaguesIds,
          leagues: (d.leagues || []).map((l: any) => ({
            id: l.id,
            name: l.name,
            logo: l.logo || null,
          })),
        });
      }
    }
  }

  return matchingDocs
    .filter((a) => a.timestamp > Date.now())
    .sort((a, b) => a.timestamp - b.timestamp);
}

export async function verifyAuthToken(idToken: string) {
  const auth = getAuth();

  return await auth.verifyIdToken(idToken);
}

export async function fetchUser(uid: string): Promise<User | Admin | null> {
  const db = getDatabase();

  const snapshot = await db.collection('users').doc(uid).get();

  if (snapshot.exists === false) {
    return null;
  }

  const d = snapshot.data()!;

  return {
    id: snapshot.id,
    email: d.email,
    roles: d.roles || ['ROLE_USER'],
    storeManagerOf: d.storeManagerOf || [],
    leagueManagerOf: d.leagueManagerOf || [],
    cities: d.cities || [],
    formats: d.formats || [],
  };
}

export async function initUser(uid: string, email: string): Promise<User> {
  const db = getDatabase();

  const user: User = {
    id: uid,
    email: email,
    roles: ['ROLE_USER'],
    cities: [],
    formats: [],
  };

  await db.collection('users').doc(uid).set(user);

  return user;
}

export async function updateUserEvents(
  uid: string,
  cities: string[],
  formats: Format[]
): Promise<void> {
  const db = getDatabase();

  await db.collection('users').doc(uid).set({cities, formats});
}

export async function fetchOrganizerManagedBy(
  uid: string
): Promise<Organizer[]> {
  const db = getDatabase();

  const snapshot = await db.collection('users').doc(uid).get();

  if (snapshot.exists === false) {
    throw new Error('Unknown user');
  }

  const user = snapshot.data() as User | Admin;

  if (!isAdmin(user)) {
    throw new Error('User is not an admin');
  }

  const results = await db
    .collection('organizers')
    .where(FieldPath.documentId(), 'in', user.storeManagerOf)
    .get();

  const organizers: Organizer[] = [];

  results.forEach((doc: any) => {
    const d = doc.data();

    organizers.push({
      id: doc.id,
      name: d.name,
      logo: d.logo || null,
      description: d.description || null,
      facebook: d.facebook || null,
      email: d.email || null,
      whatsapp: d.whatsapp || null,
      website: d.website || null,
      discord: d.discord || null,
      location: d.location && {
        address: d.location.address,
        city: d.location.city,
        province: d.location.province,
        country: d.location.country,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
      },
    });
  });
  return organizers;
}

export async function fetchLeaguesManagedBy(uid: string): Promise<League[]> {
  const db = getDatabase();

  const snapshot = await db.collection('users').doc(uid).get();

  if (snapshot.exists === false) {
    throw new Error('Unknown user');
  }

  const user = snapshot.data() as User | Admin;

  if (!isAdmin(user)) {
    throw new Error('User is not an admin');
  }

  if (user.leagueManagerOf === undefined || user.leagueManagerOf.length === 0) {
    return [];
  }

  const results = await db
    .collection('leagues')
    .where(FieldPath.documentId(), 'in', user.leagueManagerOf || [])
    .get();

  const leagues: League[] = [];

  results.forEach((doc: any) => {
    const d = doc.data();

    leagues.push({
      id: doc.id,
      name: d.name,
      description: d.description || null,
      logo: d.logo || null,
      facebook: d.facebook || null,
      email: d.email || null,
      whatsapp: d.whatsapp || null,
      website: d.website || null,
      discord: d.discord || null,
    });
  });
  return leagues;
}

export async function fetchLeagueById(leagueId: string): Promise<League> {
  const db = getDatabase();

  const snapshot = await db.collection('leagues').doc(leagueId).get();

  if (snapshot.exists === false) {
    throw new Error('Unknown league');
  }

  const d = snapshot.data() as League;

  const league: League = {
    id: snapshot.id,
    name: d.name,
    description: d.description || null,
    logo: d.logo || null,
    facebook: d.facebook || null,
    email: d.email || null,
    whatsapp: d.whatsapp || null,
    website: d.website || null,
    discord: d.discord || null,
  };

  return league;
}

export async function fetchAllEventsByOrganizer(
  organizer: string
): Promise<Tournament[]> {
  const db = getDatabase();

  const snapshot = await db
    .collection('tournaments')
    .where('organizer.id', '==', organizer)
    .get();

  const data: Tournament[] = [];

  snapshot.forEach((doc: any) => {
    const d = doc.data();

    data.push({
      id: doc.id,
      format: d.format,
      title: d.title || null,
      text: d.text || null,
      registrationLink: d.registrationLink || null,
      timestamp: d.timestamp.seconds * 1000,
      location: {
        venue: d.location.venue,
        address: d.location.address,
        city: d.location.city,
        province: d.location.province,
        country: d.location.country,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
      },
      organizer: {
        id: d.organizer.id,
        name: d.organizer.name,
        logo: d.organizer.logo || null,
      },
      leaguesIds: d.leaguesIds,
      leagues: (d.leagues || []).map((l: any) => ({
        id: l.id,
        name: l.name,
        logo: l.logo || null,
      })),
    });
  });

  return data.sort((a, b) => b.timestamp - a.timestamp);
}

export async function fetchAllEventsByLeague(
  league: string
): Promise<Tournament[]> {
  const db = getDatabase();

  const snapshot = await db
    .collection('tournaments')
    .where('leaguesIds', 'array-contains', league)
    .get();

  const data: Tournament[] = [];

  snapshot.forEach((doc: any) => {
    const d = doc.data();

    data.push({
      id: doc.id,
      format: d.format,
      title: d.title || null,
      text: d.text || null,
      registrationLink: d.registrationLink || null,
      timestamp: d.timestamp.seconds * 1000,
      location: {
        venue: d.location.venue,
        address: d.location.address,
        city: d.location.city,
        province: d.location.province,
        country: d.location.country,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
      },
      organizer: {
        id: d.organizer.id,
        name: d.organizer.name,
        logo: d.organizer.logo || null,
      },
      leaguesIds: d.leaguesIds,
      leagues: (d.leagues || []).map((l: any) => ({
        id: l.id,
        name: l.name,
        logo: l.logo || null,
      })),
    });
  });

  return data;
}

export async function unlinkEventFromLeague(
  league: string,
  eventId: string
): Promise<void> {
  const db = getDatabase();

  const event = await fetchEventById(eventId);

  if (event === null) {
    return;
  }

  await db
    .collection('tournaments')
    .doc(eventId)
    .set({
      ...event,
      timestamp: Timestamp.fromMillis(event.timestamp),
      leaguesIds: event.leaguesIds.filter((id) => id !== league),
      leagues: event.leagues.filter((l) => l.id !== league),
    });
}

export async function linkEventToLeague(
  leagueId: string,
  eventId: string
): Promise<void> {
  const db = getDatabase();

  const event = await fetchEventById(eventId);

  if (event === null) {
    return;
  }

  if (event.leaguesIds.includes(leagueId)) {
    return;
  }

  const league = await fetchLeagueById(leagueId);

  await db
    .collection('tournaments')
    .doc(eventId)
    .set({
      ...event,
      timestamp: Timestamp.fromMillis(event.timestamp),
      leaguesIds: [leagueId].concat(event.leaguesIds),
      leagues: event.leagues.concat({
        id: league.id,
        name: league.name,
        logo: league.logo,
      }),
    });
}

export async function saveNewEvent(
  organizerId: string,
  event: Pick<
    Tournament,
    'format' | 'timestamp' | 'title' | 'text' | 'registrationLink'
  > &
    Partial<Pick<Tournament, 'location'>>
): Promise<Tournament> {
  const db = getDatabase();

  const organizerSnapshot = await db
    .collection('organizers')
    .doc(organizerId)
    .get();

  const organizer = organizerSnapshot.data();

  if (organizer === undefined) {
    throw new Error('Invalid organizer');
  }

  const tournament: Omit<Tournament, 'id'> = {
    format: event.format,
    title: event.title,
    text: event.text || '',
    registrationLink: event.registrationLink || null,
    timestamp: event.timestamp,
    organizer: {
      id: organizerSnapshot.id,
      name: organizer.name,
      logo: organizer.logo || null,
    },
    location: event.location || {...organizer.location, venue: organizer.name},
    leaguesIds: [],
    leagues: [],
  };

  const doc = await db.collection('tournaments').add({
    ...tournament,
    timestamp: Timestamp.fromMillis(tournament.timestamp),
    geohash: geofire.geohashForLocation([
      tournament.location.latitude,
      tournament.location.longitude,
    ]),
  });

  return {...tournament, id: doc.id};
}

export async function updateEvent(
  eventId: string,
  event: Pick<
    Tournament,
    'format' | 'timestamp' | 'title' | 'text' | 'location' | 'registrationLink'
  >
): Promise<void> {
  const db = getDatabase();

  await db
    .collection('tournaments')
    .doc(eventId)
    .set(
      {
        ...event,
        timestamp: Timestamp.fromMillis(event.timestamp),
        geohash: geofire.geohashForLocation([
          event.location.latitude,
          event.location.longitude,
        ]),
      },
      {merge: true}
    );
}

export async function fetchAllOrganizers(): Promise<Organizer[]> {
  const db = getDatabase();

  const results = await db.collection('organizers').orderBy('name').get();

  const organizers: Organizer[] = [];

  results.forEach((doc: any) => {
    const d = doc.data();

    organizers.push({
      id: doc.id,
      name: d.name,
      logo: d.logo || null,
      description: d.description || null,
      facebook: d.facebook || null,
      email: d.email || null,
      whatsapp: d.whatsapp || null,
      website: d.website || null,
      discord: d.discord || null,
      location: d.location && {
        address: d.location.address,
        city: d.location.city,
        province: d.location.province,
        country: d.location.country,
        latitude: d.location.latitude,
        longitude: d.location.longitude,
      },
    });
  });
  return organizers;
}

export async function fetchAllLeagues(): Promise<League[]> {
  const db = getDatabase();

  const results = await db.collection('leagues').orderBy('name').get();

  const leagues: League[] = [];

  results.forEach((doc: any) => {
    const d = doc.data();

    leagues.push({
      id: doc.id,
      name: d.name,
      description: d.description || null,
      logo: d.logo || null,
      facebook: d.facebook || null,
      email: d.email || null,
      whatsapp: d.whatsapp || null,
      website: d.website || null,
      discord: d.discord || null,
    });
  });
  return leagues;
}

export async function updateOrganizer(
  organizerId: Organizer['id'],
  organizer: Pick<
    Organizer,
    'facebook' | 'whatsapp' | 'email' | 'website' | 'discord'
  >
): Promise<void> {
  const db = getDatabase();

  await db
    .collection('organizers')
    .doc(organizerId)
    .set(organizer, {merge: true});
}

export async function updateleague(
  leagueId: League['id'],
  data: Pick<
    League,
    'description' | 'facebook' | 'whatsapp' | 'email' | 'website' | 'discord'
  >
): Promise<void> {
  const db = getDatabase();

  await db.collection('leagues').doc(leagueId).set(data, {merge: true});
}
