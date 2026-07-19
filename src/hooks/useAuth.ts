import { useState } from "react";
import { Alert } from "react-native";
import { auth, getUserFromFirestore, saveUserToFirestore } from "@config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "@react-native-firebase/auth";
import { useAppDispatch, useAppSelector } from "@store";
import { clearUser, setUser } from "@store/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isLoading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      let username = "User";
      const userData = await getUserFromFirestore(firebaseUser.uid);
      if (userData) {
        username = userData.username;
      }

      dispatch(
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || email.trim(),
          username,
        }),
      );
      return true;
    } catch (error: any) {
      console.log("🚀 ~ useAuth:login ~ error:", error);
      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address format.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      } else if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      }
      Alert.alert("Sign In Failed", message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      // Store username in Firestore
      await saveUserToFirestore(
        firebaseUser.uid,
        firebaseUser.email || email.trim(),
        username.trim(),
      );

      dispatch(
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || email.trim(),
          username: username.trim(),
        }),
      );
      return true;
    } catch (error: any) {
      console.log("🚀 ~ useAuth:signup ~ error:", error);
      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        message = "An account already exists with this email.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address format.";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak. Use at least 6 characters.";
      } else if (error.code === "auth/operation-not-allowed") {
        message = "Email/password accounts are not enabled.";
      }
      Alert.alert("Sign Up Failed", message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      await signOut(auth);
      dispatch(clearUser());
      return true;
    } catch (error: any) {
      console.log("🚀 ~ useAuth:logout ~ error:", error);
      Alert.alert("Sign Out Failed", "Could not sign out. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };
}
