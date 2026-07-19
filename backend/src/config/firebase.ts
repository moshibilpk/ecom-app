import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let app: App;

if (!getApps().length) {
  const serviceAccountPath = path.resolve(
    process.cwd(),
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!) ?? "./serviceAccountKey.json",
  );

  app = initializeApp({
    credential: cert(serviceAccountPath),
  });

  console.log("✅ Firebase Admin SDK initialized");
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const fcm = getMessaging(app);
