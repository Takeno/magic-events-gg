const {initializeApp, getApps} = require('firebase-admin/app');
const {getFirestore, Timestamp, GeoPoint} = require('firebase-admin/firestore');
const {TOURNAMENTS} = require('./data');

function init() {
  initializeApp({
    projectId: process.env.FIRESTORE_PROJECT_ID,
  });
}

function getDatabase() {
  if (getApps().length === 0) {
    init();
  }

  return getFirestore();
}

async function populateDb() {
  const database = getDatabase();

  const actions = TOURNAMENTS.map((item) => ({
    id: item.id,
    datetime: Timestamp.fromDate(item.datetime),
    format: item.format,
    location: new GeoPoint(...item.location),
    venue: item.venue,
  })).map(({id, ...item}) =>
    database.collection('tournaments').doc(id).set(item)
  );

  await Promise.all(actions);
}

async function verifyDb() {
  const db = getDatabase();

  const res = await db.collection('tournaments').get();

  res.forEach((el) => console.log(el.data()));
}

async function resetDb() {
  await Promise.all([deleteCollection('tournaments')]);
}

async function deleteCollection(collectionPath, batchSize = 100) {
  const db = getDatabase();

  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

module.exports = {
  populateDb,
  resetDb,
  verifyDb,
};
