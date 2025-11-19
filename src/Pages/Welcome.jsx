import './Welcome.css';
import Button from '@/Components/Button.jsx';
import AlertBar from '@/Components/AlertBar';
import TextArea from '@/Components/TextArea.jsx';
import userLogout from '@/Logic/Logout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function Welcome()
{
    const navigate = useNavigate();

    const [inputContent, setInputContent] = useState("");
    const [displayContent, setDisplayContent] = useState("");
    const [isEmptyContent, setIsEmptyContent] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const username = localStorage.getItem("username");

    const alertMessage = (
        <>
            Content is empty. Please enter some text before submitting.
        </>
    );

    useEffect(() =>
    {
        const effectCall = async () =>
            {
            try
            {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/welcome`,
                    { withCredentials: true }
                );

                if (!response.data.loggedIn)
                {
                    navigate("/login");
                }
                else
                {
                    setLoading(false);
                    setDisplayContent(response.data.content);
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

    function handleInputContent(event)
    {
        setInputContent(event.target.value);
    }

    function onLogoutClick(url)
    {
        userLogout(url, navigate);
    }

    async function onSubmitClick(url)
    {
        if (inputContent.trim() === "")
        {
            setIsEmptyContent(true);
            setInputContent("");
        
            return;
        }

        try
        {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/add_content`,
                { content: inputContent },
                { withCredentials: true }
            );
        }
        catch (error)
        {
            console.error("Error submitting text:", error);
        }

        setDisplayContent(inputContent);
        setInputContent("");
    }

    const handleAlertBarClose = (event, reason) =>
    {
        if (reason === 'clickaway')
        {
            return;
        }

        setIsEmptyContent(false);
    };

    return loading ? <></> :
        ( <div id="welcome-container">
            <Button id="logout-button" url="/logout" onClick={onLogoutClick} title="Log out" />
            <h1 id="welcome-header" className="sansita-bold">Welcome {username} to RememberApp!</h1>
            <p id="input-content" className="sansita-regular"> {displayContent ? displayContent : "We're glad to have you here."}</p>
            <TextArea value={inputContent} handleInputContent={handleInputContent} />
            <Button id="submit-button" onClick={onSubmitClick} title="Submit Text" />
            <AlertBar
                open={isEmptyContent}
                handleClose={handleAlertBarClose}
                severity="info"
                message={alertMessage}
            />
        </div> );
}


export default Welcome;