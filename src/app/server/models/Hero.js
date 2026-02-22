import mongoose from "mongoose";

const HeroSlideSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  ctaLabel: {
    type: String,
    required: true,
  },
  ctaHref: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "Slide image",
  },
  order: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SocialLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "hover:text-gray-700",
  },
}, { _id: false });

const HeroContentSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "AZEEZ FASASI",
  },
  title: {
    type: String,
    default: "a Frontend Web Developer",
  },
  description: {
    type: String,
    default: "I specialize in crafting immersive, user-centric web experiences.",
  },
  profileImage: {
    type: String,
    default: "/images/profile.jpg",
  },
  resumeUrl: {
    type: String,
    default: "#",
  },
  social: [SocialLinkSchema],
}, { _id: false });

const HeroSchema = new mongoose.Schema({
  content: HeroContentSchema,
  slides: [HeroSlideSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
