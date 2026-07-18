import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export { auth, firestore };

/**
 * Store user profile (username) in Firestore on signup
 */
export async function saveUserToFirestore(
  uid: string,
  email: string,
  username: string,
): Promise<void> {
  await firestore().collection('users').doc(uid).set(
    {
      uid,
      email,
      username,
      createdAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Fetch username from Firestore on login
 */
export async function getUserFromFirestore(uid: string): Promise<{ username: string } | null> {
  const doc = await firestore().collection('users').doc(uid).get();
  const data = doc.data();
  if (data) {
    return data as { username: string };
  }
  return null;
}
