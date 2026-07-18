import { Router, Request, Response } from "express";
import { db, fcm } from "../config/firebase";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { userId, token, platform } = req.body as {
    userId?: string;
    token?: string;
    platform?: string;
  };

  if (!userId || !token) {
    res.status(400).json({ success: false, error: "userId and token are required" });
    return;
  }

  try {
    await db
      .collection("fcm_tokens")
      .doc(userId)
      .set(
        {
          userId,
          token,
          platform: platform ?? "unknown",
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

    console.log(`📱 Token registered for user: ${userId}`);
    res.status(200).json({ success: true, message: "Token registered successfully" });
  } catch (error) {
    console.error("Register token error:", error);
    res.status(500).json({ success: false, error: "Failed to register token" });
  }
});

router.post("/send", async (req: Request, res: Response) => {
  const { token, title, body, data } = req.body as {
    token?: string;
    title?: string;
    body?: string;
    data?: Record<string, string>;
  };

  if (!token || !title || !body) {
    res.status(400).json({ success: false, error: "token, title, and body are required" });
    return;
  }

  try {
    const messageId = await fcm.send({
      token,
      notification: {
        title,
        body,
      },
      data: data ?? {},
      android: {
        priority: "high",
        notification: {
          sound: "default",
          channelId: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    });

    console.log(`🔔 Notification sent — messageId: ${messageId}`);
    res.status(200).json({ success: true, messageId });
  } catch (error) {
    console.error("Send notification error:", error);
    res.status(500).json({ success: false, error: "Failed to send notification" });
  }
});

export default router;
