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
import Cookies from 'js-cookie';

const AuthContext = createContext({
  user: null,
  googleSignIn: async () => {},
  logout: async () => {}
});

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [savedUser, setSavedUser] = useState(null);
    
    // Helper function to set user in cookie
    const setUserCookie = (userData) => {
        if (userData) {
            // Set cookie with user data including isAdmin flag
            // Max-Age: 7 days (in seconds), Path: / to be available across all routes
            Cookies.set('user', JSON.stringify(userData), { expires: 7, path: '/' });
        } else {
            // Remove the cookie when user is null
            Cookies.remove('user', { path: '/' });
        }
    };
    
    const googleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const response = await signInWithPopup(auth, provider);
            const { uid, displayName, email, photoURL } = response.user;
            
            // Register user in MongoDB
            const mongoResp = await registerUserToMongo(uid, displayName, email, photoURL);
            const userData = mongoResp.data;
            
            // Set user in state and cookie
            setSavedUser(userData);
            setUserCookie(userData);
            localStorage.setItem("user", JSON.stringify(userData));

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
            setSavedUser(null);
            
            // Clear user from cookie and localStorage
            setUserCookie(null);
            localStorage.removeItem("user");
            
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    useEffect(() => {
        // Try to load user from localStorage on initial render
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setSavedUser(userData);
            setUserCookie(userData);
        }
        
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