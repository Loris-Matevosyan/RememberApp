import "./App.css";
import Navbar from "./Navbar.jsx";
import Routing from "./Routing.jsx";
import { BrowserRouter } from "react-router-dom";


function App()
{
  return (
    <BrowserRouter>
      <div id="app">
        <header className="app-header">
            <Navbar />
        </header>  
        <Routing />
      </div>
    </BrowserRouter>
  );
}


export default App;