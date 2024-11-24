import React from 'react';
import '../css/Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <>
        <div className="navigation">
            <div className="logo">Azeez Fasasi</div>
            <div className="menu-items">
                <Link to="/" className="about">About</Link>
                <Link to="/" className="work">Work</Link>
                <Link to="/" className="work">Contact</Link>
            </div>
        </div>
        </>
    )
}

export default Header;