import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const useAuth = (): User | null => {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return user;
};

export default useAuth;
