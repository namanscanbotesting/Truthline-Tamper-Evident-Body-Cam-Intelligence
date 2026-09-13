import { initializeApp, getApps } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { getBytes, getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

for (const [key, value] of Object.entries(firebaseConfig)) {
  if (!value) {
    throw new Error(`Missing Firebase env var: ${key}`);
  }
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export async function insertVideo(params: {
  id: string;
  filename: string;
  storagePath: string;
  contentType: string;
  recordingStartTime?: string | null;
}) {
  const { id, filename, storagePath, contentType, recordingStartTime } = params;
  await setDoc(doc(db, 'videos', id), {
    id,
    filename,
    storage_path: storagePath,
    content_type: contentType,
    recording_start_time: recordingStartTime || null,
    uploaded_at: serverTimestamp(),
    processed: 0,
    analysis: null,
    created_at: serverTimestamp()
  });
}

export async function getVideo(id: string) {
  const snap = await getDoc(doc(db, 'videos', id));
  return snap.exists() ? snap.data() : null;
}

export async function insertReport(params: {
  id: string;
  videoId: string;
  narrative: string;
  officerName?: string | null;
  badgeNumber?: string | null;
  incidentType?: string | null;
  location?: string | null;
  classification?: string | null;
  status?: string | null;
  offenseCode?: string | null;
  statuteCode?: string | null;
  locationType?: string | null;
  incidentTime?: string | null;
  useOfForce?: {
    forceUsed?: string;
    weaponTool?: string;
    resistanceLevel?: string;
    officerInjuries?: string;
    subjectInjuries?: string;
    medicalResponse?: string;
    roundsFired?: string;
  } | null;
  involvedParties?: {
    suspect1?: string;
    witness1?: string;
    witness2?: string;
  } | null;
  evidenceItems?: string[] | null;
}) {
  const {
    id,
    videoId,
    narrative,
    officerName,
    badgeNumber,
    incidentType,
    location,
    classification,
    status,
    offenseCode,
    statuteCode,
    locationType,
    incidentTime,
    useOfForce,
    involvedParties,
    evidenceItems
  } = params;
  await setDoc(doc(db, 'reports', id), {
    id,
    video_id: videoId,
    narrative,
    officer_name: officerName || null,
    badge_number: badgeNumber || null,
    incident_type: incidentType || null,
    location: location || null,
    classification: classification || null,
    status: status || null,
    offense_code: offenseCode || null,
    statute_code: statuteCode || null,
    location_type: locationType || null,
    incident_time: incidentTime || null,
    use_of_force: useOfForce || null,
    involved_parties: involvedParties || null,
    evidence_items: evidenceItems || null,
    date_time: serverTimestamp(),
    signed: 0,
    signed_at: null,
    created_at: serverTimestamp()
  });
}

export async function updateVideoAnalysis(params: {
  id: string;
  analysis: unknown;
}) {
  const { id, analysis } = params;
  await updateDoc(doc(db, 'videos', id), {
    processed: 1,
    analysis
  });
}

export async function getReport(id: string) {
  const snap = await getDoc(doc(db, 'reports', id));
  return snap.exists() ? snap.data() : null;
}

export async function getReportByVideoId(videoId: string) {
  const reportsRef = collection(db, 'reports');
  const q = query(reportsRef, where('video_id', '==', videoId), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0]?.data() || null;
}

export async function signReport(params: {
  id: string;
  narrative: string;
}) {
  const { id, narrative } = params;
  await updateDoc(doc(db, 'reports', id), {
    narrative,
    signed: 1,
    signed_at: serverTimestamp()
  });
}

export async function updateReportNarrative(params: {
  id: string;
  narrative: string;
}) {
  const { id, narrative } = params;
  await updateDoc(doc(db, 'reports', id), {
    narrative
  });
}

export async function uploadVideoToStorage(params: {
  storagePath: string;
  buffer: Buffer;
  contentType: string;
}) {
  const { storagePath, buffer, contentType } = params;
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, buffer, { contentType });
}

export async function downloadVideoFromStorage(storagePath: string) {
  const storageRef = ref(storage, storagePath);
  const data = await getBytes(storageRef);
  return Buffer.from(data);
}
