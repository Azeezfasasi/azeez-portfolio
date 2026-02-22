import Hero from "../models/Hero";
import { connectDB } from "../../server/db/connect";
import mongoose from "mongoose";

// GET all hero slides
export async function getHeroSlides() {
  await connectDB();
  let heroDoc = await Hero.findOne();
  
  // Initialize if doesn't exist
  if (!heroDoc) {
    heroDoc = await Hero.create({ slides: [] });
  }
  
  return heroDoc.slides || [];
}

// CREATE new hero slide
export async function createHeroSlide(slideData) {
  await connectDB();
  
  const newSlide = {
    _id: new mongoose.Types.ObjectId(),
    ...slideData,
  };

  let heroDoc = await Hero.findOne();
  
  if (!heroDoc) {
    heroDoc = await Hero.create({ slides: [newSlide] });
  } else {
    // Get the max order and set new order
    const maxOrder = heroDoc.slides.length > 0 
      ? Math.max(...heroDoc.slides.map(s => s.order || 0))
      : 0;
    
    newSlide.order = maxOrder + 1;
    heroDoc.slides.push(newSlide);
    await heroDoc.save();
  }
  
  return newSlide;
}

// UPDATE hero slide
export async function updateHeroSlide(slideId, slideData) {
  await connectDB();
  
  let heroDoc = await Hero.findOne();
  
  if (!heroDoc) {
    throw new Error("Hero document not found");
  }

  const slideIndex = heroDoc.slides.findIndex(
    (s) => s._id.toString() === slideId
  );

  if (slideIndex === -1) {
    throw new Error("Slide not found");
  }

  // Update slide data
  heroDoc.slides[slideIndex] = {
    ...heroDoc.slides[slideIndex],
    ...slideData,
    _id: heroDoc.slides[slideIndex]._id, // Keep original ID
  };

  heroDoc.updatedAt = Date.now();
  await heroDoc.save();

  return heroDoc.slides[slideIndex];
}

// DELETE hero slide
export async function deleteHeroSlide(slideId) {
  await connectDB();
  
  let heroDoc = await Hero.findOne();
  
  if (!heroDoc) {
    throw new Error("Hero document not found");
  }

  heroDoc.slides = heroDoc.slides.filter(
    (s) => s._id.toString() !== slideId
  );

  // Reorder remaining slides
  heroDoc.slides.forEach((slide, index) => {
    slide.order = index;
  });

  heroDoc.updatedAt = Date.now();
  await heroDoc.save();

  return { success: true, message: "Slide deleted successfully" };
}

// REORDER slides
export async function reorderHeroSlides(slideIds) {
  await connectDB();
  
  let heroDoc = await Hero.findOne();
  
  if (!heroDoc) {
    throw new Error("Hero document not found");
  }

  // Reorder based on provided order
  const reorderedSlides = slideIds.map((id, index) => {
    const slide = heroDoc.slides.find((s) => s._id.toString() === id);
    if (slide) {
      slide.order = index;
    }
    return slide;
  }).filter(Boolean);

  heroDoc.slides = reorderedSlides;
  heroDoc.updatedAt = Date.now();
  await heroDoc.save();

  return heroDoc.slides;
}

// GET Hero content (profile data)
export async function getHeroContent() {
  await connectDB();
  let hero = await Hero.findOne();
  
  // Initialize if doesn't exist
  if (!hero) {
    hero = await Hero.create({
      content: {
        name: "AZEEZ FASASI",
        title: "a Frontend Web Developer",
        description: "I specialize in crafting immersive, user-centric web experiences with a keen eye for design and functionality. With 5+ years of hands-on experience in React, HTML, CSS, JavaScript, and WordPress, I excel at transforming concepts into clean, efficient, and pixel-perfect implementations.",
        profileImage: "/images/profile.jpg",
        resumeUrl: "#",
        social: [
          { name: "LinkedIn", icon: "Linkedin", href: "https://linkedin.com/in/azeez-fasasi", color: "hover:text-blue-700" },
          { name: "GitHub", icon: "Github", href: "https://github.com/azeezfasasi", color: "hover:text-gray-800" },
          { name: "Gmail", icon: "Mail", href: "mailto:fas.azeez@gmail.com", color: "hover:text-red-500" },
          { name: "Instagram", icon: "Instagram", href: "https://instagram.com/azeezfasasi", color: "hover:text-pink-500" },
          { name: "WhatsApp", icon: "MessageCircle", href: "https://wa.me/1234567890", color: "hover:text-green-500" }
        ]
      },
      slides: []
    });
  }
  
  return hero.content || {};
}

// UPDATE Hero content (profile data)
export async function updateHeroContent(contentData) {
  await connectDB();
  
  let hero = await Hero.findOne();
  
  if (!hero) {
    hero = await Hero.create({ content: contentData, slides: [] });
  } else {
    hero.content = { ...hero.content, ...contentData };
    hero.updatedAt = Date.now();
    await hero.save();
  }
  
  return hero.content;
}
