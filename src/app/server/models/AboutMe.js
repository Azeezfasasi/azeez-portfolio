import mongoose from "mongoose";

const AboutMeSchema = new mongoose.Schema({
  eyebrow: { type: String, required: true, default: "About me" },
  title: { type: String, required: true, default: "Building products people enjoy using" },
  paragraphs: [{ type: String, required: true }],
  expertise: [{ label: { type: String, required: true }, items: [{ type: String, required: true }] }],
  availability: { type: String, required: true },
  email: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.AboutMe || mongoose.model("AboutMe", AboutMeSchema);