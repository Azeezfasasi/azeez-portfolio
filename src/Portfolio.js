import React from "react";
import Header from "./assets/components/Header";
import Hero from "./assets/components/Hero";
import CallToAction from "./assets/components/CallToAction";
import MySkills from "./assets/components/MySkills";
import LatestWork from "./assets/components/LatestWork";
import LogoBar from "./assets/components/LogoBar";
import Testimonia from "./assets/components/Testimonia";
import Footer from "./assets/components/Footer";

function Home() {
    return (
        <>
        <Header />
        <Hero />
        <LogoBar />
        <CallToAction />
        <MySkills />
        <LatestWork />
        <Testimonia />
        <Footer />
        </>
    )
}

export default Home;