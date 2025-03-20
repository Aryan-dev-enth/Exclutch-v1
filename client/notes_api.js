import axios from "axios";

export const getAllNotes = async () => {
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_ALL_NOTES}`
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
        console.log(noteId)
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
        console.log(noteId)
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