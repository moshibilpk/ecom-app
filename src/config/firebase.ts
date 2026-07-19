import { getAuth } from "@react-native-firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import { getMessaging } from "@react-native-firebase/messaging";

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
 * Fetch username from Firestore on login
 */
export async function getUserFromFirestore(uid: string): Promise<{ username: string } | null> {
  const userRef = doc(firestore, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    if (data) {
      return data as { username: string };
    }
  }
  return null;
}
