import "./Registration.css";
import Form from "@/Components/Form";
import AlertBar from "@/Components/AlertBar";
import userRegistration from "@/Logic/Registration";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Registration()
{
    const navigate = useNavigate();
    const [alert, setAlert] = useState({type: "warning", open: false});

    const alertMessage = (
        alert.type === "warning" ?
        <>
            <i>Username</i> already exists. Please choose a different one
        </> :
        <>
            <i>Passwords</i> do not match. Please try again.
        </>
    );
    
    function callUserRegistration(data)
    {
        userRegistration(data, setAlert, navigate);
    }

    const handleAlertBarClose = (event, reason) =>
    {
        if (reason === 'clickaway')
        {
            return;
        }

        setAlert({ ...alert, open: false });
    };

    return (
        <>
            <Form text="Registration" userCheck={callUserRegistration} />
            <AlertBar
                open={alert.open}
                handleClose={handleAlertBarClose}
                severity={alert.type}
                message={alertMessage}
            />
        </>
    );
}


export default Registration;