import React, { useState } from "react";
import "./Navbar.css";
import Img1 from "../components/image/slide-1.png"
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={Img1}/>
      </div>
      <div className={`navbar-links ${isOpen ? "active" : ""}`}> 
       <a href="#typing">Typing Tutor</a>
        <a href="#typingTest">Typing Test</a>
      </div>
      <button className="navbar-toggle" onClick={toggleNavbar}>
        <span className="navbar-toggle-icon"></span>
      </button>
    </nav>
  );
};

export default Navbar;
