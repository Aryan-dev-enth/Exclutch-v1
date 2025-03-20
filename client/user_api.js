import axios from 'axios'
export const registerUserToMongo = async (uid, name, email, profilePic) => {
    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_REGISTER_USER}`,
        { uid, name, email, profilePic }
    );

    console.log(response)
    

};
