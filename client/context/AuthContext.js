'use client'
import { useContext, createContext, useState, useEffect } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged as firebaseAuthStateChanged, 
  GoogleAuthProvider 
} from "firebase/auth";
import { auth } from "../firebase.js";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    const logout = () => {
        return signOut(auth);
    }

    useEffect(() => {
        // Make sure auth is properly initialized before calling onAuthStateChanged
        if (auth) {
            const unsubscribe = firebaseAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
            return () => unsubscribe();
        }
    }, []);

    return <AuthContext.Provider value={{user, googleSignIn, logout}}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
    return useContext(AuthContext);
};