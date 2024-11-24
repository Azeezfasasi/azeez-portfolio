import React from "react";
import '../css/LogoBar.css';
import google from '../images/google.svg';
import nike from '../images/nike.svg';
import samsung from '../images/samsung.svg';
import apple from '../images/apple.svg';
import adidas from '../images/adidas.svg';

function LogoBar() {
    return (
        <>
        <div className="logo-bar">
            <img className="group-5334" src={google} />
            <img className="image-1-traced" src={nike} />
            <img className="image-5-traced" src={samsung} />
            <img className="image-2-traced" src={apple} />
            <img className="image-7-traced" src={adidas} />
        </div>

        </>
    )
}

export default LogoBar;