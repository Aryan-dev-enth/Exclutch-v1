import axios from 'axios'
export const registerUserToMongo = async (uid, name, email, profilePic) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_REGISTER_USER}`,
            { uid, name, email, profilePic });
            
            if(response.status ==200)
                return response.data
    } catch (error) {
        
    }

  
    

};


export const getUserByUID = async (uid) => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${uid}`);
    
            if(response.status ==200)
                return response.data
    } catch (error) {
        
    }
}