import {initializeApp, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.GSERVICE_ACCOUNT_SECRETS!);

initializeApp({
  credential: cert(serviceAccount),
});

export async function fetchAllEvents() {
  const db = getFirestore();

  const snapshot = await db.collection('tournaments').get();

  const data: any[] = [];

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
