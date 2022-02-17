import {initializeApp, getApps, cert} from 'firebase-admin/app';
import {getFirestore, Timestamp} from 'firebase-admin/firestore';
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
  };

  return tournament;
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
        });
      }
    }
  }

  return matchingDocs;
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
    roles: d.roles,
    storeManagerOf: d.storeManagerOf,
  };
}

export async function initUser(uid: string, email: string): Promise<User> {
  const db = getDatabase();

  const user: User = {
    id: uid,
    email: email,
    roles: ['ROLE_USER'],
  };

  await db.collection('users').doc(uid).set(user);

  return user;
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
    .where('id', 'in', user.storeManagerOf)
    .get();

  const organizers: Organizer[] = [];

  results.forEach((doc: any) => {
    const d = doc.data();

    organizers.push({
      id: doc.id,
      name: d.name,
      logo: d.logo,
      address: d.address,
      city: d.city,
      location: {
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
    });
  });

  return data;
}

export async function saveNewEvent(
  organizerId: string,
  event: Pick<Tournament, 'format' | 'timestamp' | 'title' | 'text'>
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

  const tournament: Tournament = {
    id: '' + Date.now(),
    format: event.format,
    title: event.title,
    text: event.text,
    timestamp: event.timestamp,
    organizer: {
      id: organizer.id,
      name: organizer.name,
      logo: organizer.logo || null,
    },
    location: {...organizer.location, venue: organizer.name},
  };

  await db.collection('tournaments').add({
    ...tournament,
    timestamp: Timestamp.fromMillis(tournament.timestamp),
  });

  return tournament;
}
