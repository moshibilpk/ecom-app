import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

let app: App;

if (!getApps().length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
      }
      credential = cert(serviceAccount);
    } catch (e) {
      console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable:", e);
      credential = cert(path.resolve(process.cwd(), "./serviceAccountKey.json"));
    }
  } else {
    const serviceAccountPath = path.resolve(
      process.cwd(),
      process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "./serviceAccountKey.json",
    );
    credential = cert(serviceAccountPath);
  }

  app = initializeApp({
    credential,
  });

  console.log("✅ Firebase Admin SDK initialized");
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const fcm = getMessaging(app);
