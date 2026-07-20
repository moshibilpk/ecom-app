import { getAuth } from "@react-native-firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import { getMessaging } from "@react-native-firebase/messaging";
import { FirestoreUser } from "@models";

export const auth = getAuth();
export const firestore = getFirestore();
export const messaging = getMessaging();

/**
 * Store user profile (username) in Firestore on signup
 */
export async function saveUserToFirestore(
  uid: string,
  email: string,
  username: string,
): Promise<void> {
  const userRef = doc(firestore, "users", uid);
  await setDoc(
    userRef,
    {
      uid,
      email,
      username,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Fetch user document from Firestore on login
 */
export async function getUserFromFirestore(uid: string): Promise<FirestoreUser | null> {
  const userRef = doc(firestore, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    if (data) {
      return data as FirestoreUser;
    }
  }
  return null;
}
