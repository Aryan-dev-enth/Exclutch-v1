import axios from "axios";
import { removeFile } from "./components/utils/uploadToSupabase";


export const postNotes = async (formData, userId) => {
  try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/create/${userId}`,
          formData
      );
      
      if(response.status==200)
        {
            return response.data;
        }
        return null;
    } catch (error) {
      console.error("Error fetching note:", error);
      return null;
    }
}

export const getAllNotes = async (userId) => {

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/getAll/${userId} `,
    
);
    
    if(response.status==200)
    {
        return response.data;
    }
}

export const fetchNoteById = async (noteId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/${noteId}`);
     
      if(response.status==200)
        {
            return response.data;
        }
        return null;
    } catch (error) {
      console.error("Error fetching note:", error);
      return null;
    }
  };

  export const postComment = async (text, userId,  noteId) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/${noteId}/comment`,
            {userId, text}
        );
        
        if(response.status==200)
          {
              return response.data;
          }
          return null;
      } catch (error) {
        console.error("Error fetching note:", error);
        return null;
      }
  }

  export const likeNote = async (userId, noteId) => {
    try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/${noteId}/like`,
            {userId}
        );
        
        if(response.status==200)
          {
              return response.data;
          }
          return null;
      } catch (error) {
        console.error("Error fetching note:", error);
        return null;
      }
  }

  export const noteApproval = async (noteId, userId) => {
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/${noteId}/approve`,
          {userId}
      );
      
      if(response.status==200)
        {
            return response.data;
        }
        return null;
    } catch (error) {
      console.error("Error fetching note:", error);
      return null;
    }
  }

  export const rejectNotes = async (note, userId) => {
    try {
      
      // const sb_deleted= await removeFile(note.supabase_path);
      // console.log("deleted from supabase", sb_deleted)
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/${note._id}`,
        {
          data: { userId }, // ✅ Send userId in the request body
        }
      );
      
      
      if(response.status==200)
        {
            return response.data;
        }
        return response.data;
    } catch (error) {
      console.error("Error fetching note:", error);
      return null;
    }
  }

  export const updateNote = async (noteId, updateFields, userId) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/notes/${noteId}/update`,
        { ...updateFields, userId }
      );
  
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error updating note:", error);
      return null;
    }
  };
  
