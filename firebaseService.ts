import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  projectId: 'ganjoor-291d5',
});

const db = getFirestore();

export async function shouldAllowRequest(ip: string): Promise<boolean> {
  const docRef = db.collection('requestLogs').doc(ip);
  const doc = await docRef.get();
  const now = Date.now();
  const limit = 10 * 60 * 1000;

  if (!doc.exists) {
    await docRef.set({ lastRequest: now, count: 1 });
    return true;
  }

  const data = doc.data();
  const elapsed = now - data!.lastRequest;
  let count = data!.count;

  if (elapsed > limit) {
    await docRef.set({ lastRequest: now, count: 1 });
    return true;
  }

  if (count >= 5) {
    return false;
  }

  await docRef.update({ count: count + 1 });
  return true;
}
