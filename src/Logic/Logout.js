import axios from 'axios';


async function userLogout(endpoint, navigate)
{
    try
    {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}${endpoint}`,
            {},
            { withCredentials: true }
        );
        
        localStorage.removeItem("username");
        
        navigate(response.data.redirect);
    }
    catch (error)
    {
        console.error("Logout failed: ", error);
    }
}


export default userLogout;