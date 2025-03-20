"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAllNotes } from "@/notes_api";
import { UserAuth } from "./AuthContext";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = UserAuth();


  

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await getAllNotes(JSON.parse(localStorage.getItem("user"))._id)
          setNotes(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [user]);

  return (
    <NotesContext.Provider value={{ notes, loading, error }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NotesContext);
};
