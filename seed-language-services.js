// This script seeds the MongoDB database with initial Languages and Services data
// Run with: node seed-language-services.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const LanguageServiceSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const LanguageService = mongoose.model('LanguageService', LanguageServiceSchema);

const initialData = [
  // Languages
  {
    type: 'language',
    name: 'React',
    icon: '⚛️',
    order: 1,
    isActive: true,
  },
  {
    type: 'language',
    name: 'HTML',
    icon: '🔴',
    order: 2,
    isActive: true,
  },
  {
    type: 'language',
    name: 'CSS',
    icon: '🟦',
    order: 3,
    isActive: true,
  },
  {
    type: 'language',
    name: 'Tailwind CSS',
    icon: '💨',
    order: 4,
    isActive: true,
  },
  {
    type: 'language',
    name: 'JavaScript',
    icon: '📝',
    order: 5,
    isActive: true,
  },
  {
    type: 'language',
    name: 'WordPress',
    icon: '🔵',
    order: 6,
    isActive: true,
  },
  // Services
  {
    type: 'service',
    name: 'Web Design and Development',
    icon: '🖥️',
    description: 'Create stunning and functional websites tailored to your needs',
    image: '/images/services/web-design.jpg',
    order: 1,
    isActive: true,
  },
  {
    type: 'service',
    name: 'Website Management',
    icon: '⚙️',
    description: 'Professional maintenance and updates for your online presence',
    image: '/images/services/website-management.jpg',
    order: 2,
    isActive: true,
  },
  {
    type: 'service',
    name: 'Tutorship',
    icon: '👨‍🏫',
    description: 'Learn web development and programming from expert instructors',
    image: '/images/services/tutorship.jpg',
    order: 3,
    isActive: true,
  },
  {
    type: 'service',
    name: 'IT Consultancy',
    icon: '💼',
    description: 'Strategic tech solutions to drive your business forward',
    image: '/images/services/it-consultancy.jpg',
    order: 4,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await LanguageService.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert initial data
    console.log('📝 Seeding initial data...');
    const result = await LanguageService.insertMany(initialData);
    console.log(`✅ Seeded ${result.length} items successfully`);

    console.log('\n📊 Seed Summary:');
    const languages = await LanguageService.countDocuments({ type: 'language' });
    const services = await LanguageService.countDocuments({ type: 'service' });
    console.log(`   Languages: ${languages}`);
    console.log(`   Services: ${services}`);
    console.log(`   Total: ${languages + services}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
