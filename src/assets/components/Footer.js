import React from "react";
import '../css/Footer.css';
import discord from '../images/discord.svg';
import facebook from '../images/facebook.svg';
import social1 from '../images/social1.svg';
import instagram from '../images/instagram.svg';
import behance from '../images/behance.svg';

function Footer() {
    return (
        <>
        <div className="contact-section">
            <div className="lets-work-together">Lets work together</div>
            <div className="contact-section-content">
                <div className="contact-info">
                <div className="title-description">
                    <div className="this-is-a-template-figma-file-turned-into-code-using-anima-learn-more-at-anima-app-com-this-is-a-template-figma-file-turned-into-code-using-anima-learn-more-at-anima-app-com">
                    This is a template Figma file, turned into code using Anima. Learn
                    more at AnimaApp.com This is a template Figma file, turned into code
                    using Anima. Learn more at AnimaApp.com
                    </div>
                </div>
                <div className="social-links">
                    <img className="discord" src={discord} />
                    <img className="facebook" src={facebook} />
                    <img className="dribbble" src={social1} />
                    <img className="nstagram" src={instagram} />
                    <img className="behance" src={behance} />
                </div>
                </div>
                <form className="contact-form">
                    <div className="input-fields">
                        <input className="input-field" type="text" placeholder="Name" required/>
                        <input className="input-field" type="email" placeholder="Email" required/>
                    </div>
                    <button className="button">
                        <div className="contact">Submit</div>
                    </button>
                </form>
            </div>
        </div>

        </>
    )
}

export default Footer;