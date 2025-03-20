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
  };