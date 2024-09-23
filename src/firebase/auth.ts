import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Sign up
export const signUp = async (email: string, password: string) => {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
};

// Sign in
export const signIn = async (email: string, password: string) => {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const logOut = async () => {
  const auth = getAuth();
  await signOut(auth);
};
