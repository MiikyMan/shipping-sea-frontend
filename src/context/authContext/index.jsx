import React, { useContext, useState, useEffect, createContext } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { baseURL } from "../../components/userIDConfig";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserdb, setCurrentUserdb] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      console.log("Current user:", user.uid); // Log the current user to verify
      const response = await axios.get(`${baseURL}/users/${user.uid}`);
      setCurrentUserdb(response.data[0]);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    userLoggedIn: !!currentUser,
    currentUser,
    displayName: currentUserdb?.name || "",
    uid: currentUser?.uid,
    photoURL: String(currentUserdb?.profilePicUrl),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
