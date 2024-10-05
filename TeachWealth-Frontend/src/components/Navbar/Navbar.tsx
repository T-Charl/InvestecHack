import React from 'react';
import { Link } from 'react-router-dom';
import "./Styles.css" // Import the CSS file
import investecLogo from '@/assets/investec_logo.png'

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <a className="navbar-brand" href="#">
            <img src={investecLogo} alt='Investec logo'width={100} height={100}/>
          </a>
          <div className="navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Investments
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
