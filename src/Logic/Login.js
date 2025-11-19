import axios from "axios";


async function userLogin(data, setIsWrongUser, navigate)
{
    try
    {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/login`,
            data,
            { withCredentials: true }
        );

        if(response.data.loggedIn)
        {
            localStorage.setItem("username", response.data.username);
            navigate("/welcome");
        }
        else
        {
            setIsWrongUser(true);
        }
    }
    catch (error)
    {
        console.error("Login failed", error);
    }
}


export default userLogin;