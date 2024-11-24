import React from "react";
import '../css/CallToAction.css';
import greencard from '../images/greencard.svg';
import redcard from '../images/redcard.svg';
import { Link } from "react-router-dom";

function CallToAction() {
    return (
        <>
        <div className="version-2">
            <img className="frame-1" src={redcard} />
            <div className="text">
                <div className="branding-image-making">Branding | Image making</div>
                <div className="visual-designer">Visual Designer</div>
                <div className="this-is-a-template-figma-file-turned-into-code-using-anima-learn-more-at-anima-app-com">
                This is a template Figma file, turned into code using Anima. Learn more at
                AnimaApp.com
                </div>
                <div className="cta-button">
                <Link to="/" className="cta-contact">Contact</Link>
                </div>
            </div>
            <img className="frame-2" src={greencard} />
        </div>

        </>
    )
}

export default CallToAction;