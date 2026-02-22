import mongoose from "mongoose";

const StatItemSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true, // e.g., "40+", "5+", "30+"
  },
  description: {
    type: String,
    required: true, // e.g., "PROJECTS COMPLETED"
  },
  icon: {
    type: String,
    default: "CheckCircle2", // Icon name from lucide-react
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

const HomeStatsSchema = new mongoose.Schema({
  stats: [StatItemSchema],
  backgroundColor: {
    type: String,
    default: "from-blue-400 to-blue-500", // Tailwind gradient classes
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.HomeStats || mongoose.model("HomeStats", HomeStatsSchema);
