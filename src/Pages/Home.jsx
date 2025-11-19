import "./Home.css";
import Button from "@/Components/Button";
import { useNavigate } from "react-router-dom";


function Home()
{
    const navigate = useNavigate();

    function handleButtonClick(url)
    {
        navigate(url);
    }

    return (
        <div id="home">
            <div id="greeting">
                <h1 id="header" className="sansita-bold">Welcome to RememberApp</h1>
            </div>
            <div id="button-container">
                <Button id="registration-button" url="/registration" onClick={handleButtonClick} title="Register" />
                <Button id="login-button" url="/login" onClick={handleButtonClick} title="Login" />
            </div>
        </div>
    )
}


export default Home;