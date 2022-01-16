import {initializeApp, getApps, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';

function getDatabase() {
  if (getApps().length === 0) {
    const serviceAccount = JSON.parse(process.env.GSERVICE_ACCOUNT_SECRETS!);

    initializeApp({
      credential: cert(serviceAccount),
    });
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
