import Home from "./Pages/Home";
import Registration from "./Pages/Registration";
import Login from  "./Pages/Login";
import Welcome from "./Pages/Welcome";
import { Routes, Route } from "react-router-dom";


function Routing()
{
    return  (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />
        </Routes>
    );
}


export default Routing;