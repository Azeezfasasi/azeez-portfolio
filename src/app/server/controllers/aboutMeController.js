import AboutMe from "../models/AboutMe";
import { connectDB } from "../../server/db/connect";

export const DEFAULT_ABOUT_ME = {
  eyebrow: "About me",
  title: "I turn complex product ideas into fast, thoughtful experiences.",
  paragraphs: [
    "I am a Product-Focused Frontend Engineer with over 5 years of experience architecting, building, and optimizing scalable web applications. My core expertise lies in crafting high-performance user interfaces using React, Next.js, and Tailwind CSS, backed by robust server-side integrations using Node.js and MongoDB.",
    "Throughout my career, I have focused on writing clean, modular code, optimizing web performance and Core Web Vitals, and translating complex business requirements into seamless, responsive user experiences. Having managed over 90 repositories and deployed numerous live production systems, I treat version control, performance architecture, and clean UI state management as first-class citizens.",
  ],
  expertise: [
    { label: "Frontend", items: ["React.js", "Next.js", "JavaScript (ES6+)", "TypeScript", "Tailwind CSS", "HTML5/CSS3"] },
    { label: "Backend & DB", items: ["Node.js", "Express.js", "MongoDB", "RESTful APIs"] },
    { label: "Tools & Workflow", items: ["Git", "GitHub", "CI/CD", "Vercel Deployment", "SEO Optimization"] },
  ],
  availability: "Open to permanent, full-time roles in Germany, Europe, or North America. Available for relocation or remote opportunities.",
  email: "info@azeezportfolio.com",
};

export async function getAboutMe() {
  await connectDB();
  let aboutMe = await AboutMe.findOne().lean();
  if (!aboutMe) {
    aboutMe = await AboutMe.create(DEFAULT_ABOUT_ME);
    return aboutMe.toObject();
  }
  return aboutMe;
}

export async function updateAboutMe(data) {
  await connectDB();
  const update = {
    eyebrow: String(data.eyebrow || "").trim(),
    title: String(data.title || "").trim(),
    paragraphs: Array.isArray(data.paragraphs) ? data.paragraphs.map((paragraph) => String(paragraph).trim()).filter(Boolean) : [],
    expertise: Array.isArray(data.expertise) ? data.expertise.map((group) => ({
      label: String(group.label || "").trim(),
      items: Array.isArray(group.items) ? group.items.map((item) => String(item).trim()).filter(Boolean) : [],
    })).filter((group) => group.label && group.items.length) : [],
    availability: String(data.availability || "").trim(),
    email: String(data.email || "").trim(),
    updatedAt: new Date(),
  };

  if ([update.eyebrow, update.title, update.availability, update.email].some((field) => !field) || !update.paragraphs.length || !update.expertise.length) {
    throw new Error("Please complete all About Me fields");
  }

  return AboutMe.findOneAndUpdate({}, update, { new: true, upsert: true, runValidators: true }).lean();
}