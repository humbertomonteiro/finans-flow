import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AuthRepository, User } from "../../domain";
import { auth } from "../services/firebaseConfig";
import firebase from "firebase/auth";

function mapFirebaseUser(firebaseUser: firebase.User): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || "Usuário",
  };
}

export default class FirebaseAuthRepository implements AuthRepository {
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(
        auth,
        (user) => {
          if (user) {
            resolve(mapFirebaseUser(user));
          } else {
            resolve(null);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async signIn(email: string, password: string): Promise<User | null> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return mapFirebaseUser(userCredential.user);
  }

  async signUp(name: string, email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { uid } = userCredential.user;
    return { uid, name, email };
  }

  async logOut(): Promise<void> {
    await signOut(auth);
  }
}
