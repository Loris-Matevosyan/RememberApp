import "./Login.css";
import Form from "@/Components/Form";
import AlertBar from "@/Components/AlertBar";
import userLogin from "@/Logic/Login";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


function Login()
{
    const [isWrongUser, setIsWrongUser] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    const navigate = useNavigate();

    const alertMessage = (
    <>
        <i>Username</i> or <i>Password</i> is incorrect. <br /> 
        Please try again.
    </>
    );

    useEffect(() =>
    {
        const effectCall = async () =>
        {
            try
            {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/login`,
                    { withCredentials: true }
                );
            
                if (response.data.loggedIn)
                {
                    navigate("/welcome");
                }
                else
                {
                    setLoadingPage(false);
                }
            }
            catch (error)
            {
                console.error("Error during authentication check:", error);
                navigate("/login");
            }
        };

        effectCall();
    }, [navigate]);
    
    function callUserLogin(data)
    {
        userLogin(data, setIsWrongUser, navigate);
    }

    const handleAlertBarClose = (event, reason) =>
    {
        if (reason === 'clickaway') {
            return;
        }

        setIsWrongUser(false);
    };

    return loadingPage ? <></> : (
        <>
            <Form text="Login"  userCheck={callUserLogin}/>
            <AlertBar
                open={isWrongUser}
                handleClose={handleAlertBarClose}
                severity="error"
                message={alertMessage}
            />
        </>
    );
}

export default Login;