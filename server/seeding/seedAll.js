require('dotenv').config();
const mongoose = require('mongoose');

const createAdminUser = require('./seedadmin');
const createSettingSeed = require('./createSettingSeed');
const seedCustomers = require('./seedCustomers');
const seedInvoices = require('./seedInvoices');

const seedAll = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickbill';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Run all seeding scripts
    await createAdminUser();
    await createSettingSeed();
    await seedCustomers();
    await seedInvoices();

    console.log('✅ All seeding completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedAll();
