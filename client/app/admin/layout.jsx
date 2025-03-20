"use client";
import { UsersProvider } from "@/context/UsersContext";
import { NotesProvider } from "@/context/NotesContext";

const Layout = ({ children }) => {
  return (
    <UsersProvider>
      <NotesProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow container mx-auto p-4">{children}</main>
         
        </div>
      </NotesProvider>
    </UsersProvider>
  );
};

export default Layout;
