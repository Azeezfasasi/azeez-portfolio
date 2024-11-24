import React from "react";
import '../css/Hero.css';
import headerimage from '../images/headerimage.svg';
import { Link } from "react-router-dom";

function Hero() {
    return (
        <>
        <div className="version-1">
            <div className="header-content">
                <div className="hero-title-subtitle">
                <div className="hero-title">Branding | Image making</div>
                <div className="hero-subtitle">Visual Designer</div>
                <div className="this-is-a-template-figma-file-turned-into-code-using-anima-learn-more-at-anima-app-com">
                    This is a template Figma file, turned into code using Anima.
                    <br />
                    Learn more at AnimaApp.com
                </div>
                </div>
                <div className="button">
                <Link to="/" className="hero-contact">Contact</Link>
                </div>
            </div>
            <img className="header-image-1" src={headerimage} />
        </div>

        </>
    )
}

export default Hero;