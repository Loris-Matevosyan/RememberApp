import axios from "axios";

async function userRegistration(data, setAlert, navigate)
{
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/registration`,
            data,
            { withCredentials: true }
        );
        
        if (response.data.isPasswordMismatch === true)
        {
            setAlert({ type: "error", open: true });
            return;
        }

        if (response.data.isAccountExists === true)
        {
            setAlert({ type: "warning", open: true });  
            return;
        }
        
        if (response.data.isRegistered === true)
        {
            localStorage.setItem("username", response.data.username);
            navigate("/welcome");
        }

    } catch (error) {
        console.error("Registration failed", error);
    }
}

export default userRegistration;