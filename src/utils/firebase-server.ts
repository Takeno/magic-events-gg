import {initializeApp, getApps, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import * as geofire from 'geofire-common';

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

export async function fetchAllEvents(): Promise<Tournament[]> {
  const db = getDatabase();

  const snapshot = await db.collection('tournaments').get();

  const data: Tournament[] = [];

  snapshot.forEach((doc: any) => {
    const d = doc.data();

    data.push({
      id: doc.id,
      format: d.format,
      venue: d.venue,
      timestamp: d.datetime.seconds,
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
    venue: d.venue,
    timestamp: d.datetime.seconds,
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
          venue: d.venue,
          timestamp: d.datetime.seconds,
        });
      }
    }
  }

  return matchingDocs;
}
