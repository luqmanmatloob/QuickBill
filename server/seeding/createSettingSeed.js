const Setting = require('../models/settingModel');

const createSettingSeed = async () => {
  try {
    const existingSetting = await Setting.findOne();

    if (!existingSetting) {
      const dummySetting = new Setting({
        companyName: 'Demo Company',
        phoneNumber: '123-456-7890',
        address: '123 Demo Street',
        city: 'Demo City',
        state: 'Demo State',
        country: 'Demoland',
        url: 'https://demo.com',
        taxRate: 8.5,
        imageUrl: '' // You can set a dummy image path if needed
      });

      await dummySetting.save();
      console.log('✅ Setting seeded successfully.');
    } else {
      console.log('⚠️ Setting already exists.');
    }
  } catch (error) {
    console.error('❌ Error seeding setting:', error);
  }
};

module.exports = createSettingSeed;
