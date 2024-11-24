import React from "react";
import '../css/LatestWork.css';
import project1 from '../images/project1.svg';
import project2 from '../images/project2.svg';
import project3 from '../images/project3.svg';
import project4 from '../images/project4.svg';
import project5 from '../images/project5.svg';
import project6 from '../images/project6.svg';
import { Link } from "react-router-dom";

function LatestWork() {
    return (
        <>
        <div className="gallery-section">
            <div className="latest-work">Latest work</div>
            <div className="gallery-cards-section">
                <div className="gallery-card">
                    <Link to="/">
                        <img className="gallery-image" src={project1} />
                    </Link>
                    <div className="g-title-description">
                        <div className="project-title">Project title</div>
                        <div className="ui-art-drection">UI, Art drection</div>
                    </div>
                </div>
                <div className="component-9">
                <Link to="/">
                    <img className="gallery-image" src={project2} />
                </Link>
                <div className="title-description">
                    <div className="project-title">Project title</div>
                    <div className="ui-art-drection">UI, Art drection</div>
                </div>
                </div>
                <div className="component-10">
                <Link to="/">
                <img className="gallery-image" src={project3}/>
                </Link>
                
                <div className="title-description">
                    <div className="project-title">Project title</div>
                    <div className="ui-art-drection">UI, Art drection</div>
                </div>
                </div>
                <div className="component-11">
                <Link to="/">
                <img className="gallery-image" src={project4} />
                </Link>
                <div className="title-description">
                    <div className="project-title">Project title</div>
                    <div className="ui-art-drection">UI, Art drection</div>
                </div>
                </div>
                <div className="component-12">
                <Link to="/">
                    <img className="gallery-image" src={project5} />
                </Link>
                <div className="title-description">
                    <div className="project-title">Project title</div>
                    <div className="ui-art-drection">UI, Art drection</div>
                </div>
                </div>
                <div className="component-13">
                <Link to="/">
                    <img className="gallery-image" src={project6} />
                </Link>
                <div className="title-description">
                    <div className="project-title">Project title</div>
                    <div className="ui-art-drection">UI, Art drection</div>
                </div>
                </div>
            </div>
        </div>

        </>
    )
}

export default LatestWork;