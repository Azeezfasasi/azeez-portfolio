import React from "react";
import '../css/MySkills.css';
import card1 from '../images/card1.svg';
import card2 from '../images/card2.svg';
import card3 from '../images/card3.svg';
import card4 from '../images/card4.svg';

function MySkills() {
    return (
        <>
        <div className="myskills-container">
            <div className="myskills-section">
                <div className="skills-card">
                <img className="skills-card-icon" src={card1}  />
                <div className="skills-title-description">
                    <div className="skills-title">Product Design</div>
                    <div className="this-is-a-template-figma-file-turned-into-code-using-anima-learn-more-at-anima-app-com">
                    This is a template Figma file, turned into code using Anima. Learn
                    more at AnimaApp.com
                    </div>
                </div>
                </div>
                <div className="skills-card">
                <img className="skills-card-icon2" src={card2} />
                <div className="skills-title-description">
                    <div className="skills-title">Visual Design</div>
                    <div className="this-is-a-template-figma-file-turned-into-code-using-anima-learn-more-at-anima-app-com">
                    This is a template Figma file, turned into code using Anima. Learn
                    more at AnimaApp.com
                    </div>
                </div>
                </div>
            </div>
            <div className="myskills-section">
                <div className="skills-card">
                <img className="skills-card-icon3" src={card3} />
                <div className="skills-title-description">
                    <div className="skills-title">Art Direction</div>
                    <div className="this-is-a-template-figma-file-turned-into-code-using-anima-learn-more-at-anima-app-com">
                    This is a template Figma file, turned into code using Anima. Learn
                    more at AnimaApp.com
                    </div>
                </div>
                </div>
                <div className="skills-card">
                <img className="skills-card-icon4" src={card4} />
                <div className="skills-title-description">
                    <div className="skills-title">UI/UX</div>
                    <div className="this-is-a-template-figma-file-turned-into-code-using-anima-learn-more-at-anima-app-com">
                    This is a template Figma file, turned into code using Anima. Learn
                    more at AnimaApp.com
                    </div>
                </div>
                </div>
            </div>
        </div>

        </>
    )
}

export default MySkills;