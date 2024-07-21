import React, { useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "@firebase/auth";
import { firebaseAppAdmin, firebaseAppSubAdmin } from "./firbase"; // Import your Firebase config
import Header from "./Header";
const AuthContext = React.createContext();
const Admin = getAuth(firebaseAppAdmin);
const Subadmin = getAuth(firebaseAppSubAdmin);
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState("");
  const userRoleFromLocalStorage = localStorage.getItem("userInfo");
  const [userRole, setUserRole] = useState(" ");
  useEffect(() => {
    if (userRoleFromLocalStorage) {
      console.log("Hello world from user");
      setCurrentUser(userRoleFromLocalStorage);
      setUserRole(userRoleFromLocalStorage);
    } else {
      setCurrentUser(null);
      setUserRole(null);
    }
  }, []);
  console.log("This is form to want to set the data", userRoleFromLocalStorage);

  console.log("This is propes data", userRole);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("asjdlfkajsdlfjlsdjlf");
    const unsubscribeAdmin = onAuthStateChanged(Admin, (user) => {
      if (user) {
        setLoading(false);
      } else {
        const unsubscribeSubAdmin = onAuthStateChanged(Subadmin, (user) => {
          if (user) {
          } else {
            setCurrentUser(null);
          }
          setLoading(false);
        });

        return () => unsubscribeSubAdmin();
      }
    });

    return () => unsubscribeAdmin();
  }, []);

  const value = {
    currentUser,
    userRole,
    setCurrentUser,
    setUserRole,
    setLoading,
  };
  return (
    <div>
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    </div>
  );
}
