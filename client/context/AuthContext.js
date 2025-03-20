'use client'
import { useContext, createContext, useState, useEffect } from "react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged as firebaseAuthStateChanged, 
  GoogleAuthProvider 
} from "firebase/auth";
import { auth } from "../firebase.js";
import { registerUserToMongo } from "@/user_api.js";

const AuthContext = createContext({
  user: null,
  googleSignIn: async () => {},
  logout: async () => {}
});

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [savedUser, setSavedUser] = useState(null);
    
    const googleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const response = await signInWithPopup(auth, provider);
            const { uid, displayName, email, photoURL } = response.user;
            
            // Register user in MongoDB
            const mongoResp = await registerUserToMongo(uid, displayName, email, photoURL);
            setSavedUser(mongoResp.data);
            localStorage.setItem("user", JSON.stringify(mongoResp.data));

            if (!mongoResp || mongoResp.error) {
                console.error("MongoDB registration failed:", mongoResp?.error);
            }

        } catch (error) {
            console.error("Google sign-in failed:", error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    useEffect(() => {
        if (auth) {
            const unsubscribe = firebaseAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
            return () => unsubscribe();
        }
    }, []);
    
    return (
        <AuthContext.Provider value={{ user, googleSignIn, logout, savedUser, setSavedUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("UserAuth must be used within an AuthContextProvider");
    }
    return context;
};
