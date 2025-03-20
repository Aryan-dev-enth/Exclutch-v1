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


const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    

    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const response= await signInWithPopup(auth, provider);

        const user = response.user;

        const  mongo_resp= await registerUserToMongo(user.uid, user.displayName, user.email, user.photoURL);
        
        
        
    }

    const logout = () => {
        return signOut(auth);
    }

    useEffect(() => {
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