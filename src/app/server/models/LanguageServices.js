import mongoose from 'mongoose';

const LanguageServiceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['language', 'service'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: String,
    image: String,
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.LanguageService ||
  mongoose.model('LanguageService', LanguageServiceSchema);
