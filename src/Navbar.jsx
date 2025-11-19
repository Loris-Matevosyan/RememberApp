import "./Navbar.css";
import { Link } from "react-router-dom";


function Navbar()
{
    return (
        <div id="navbar-container">
            <nav className="navbar dm-sans">
                <Link to="/" className="nav-link home-link sansita-bold">Home</Link>
                <Link to="/registration" className="nav-link sansita-bold">Registration</Link>
                <Link to="/login" className="nav-link sansita-bold">Login</Link>
                <p className="nav-title sansita-bold">RememberApp</p>
            </nav>
        </div>
    );
}


export default Navbar;