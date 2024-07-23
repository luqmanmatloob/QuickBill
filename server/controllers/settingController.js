const Setting = require('../models/settingModel');

// Controller function for updating or creating settings
const updateSettings = async (req, res) => {
  // Extracting data from the request body
  const { companyName, phoneNumber, address, city, state, country, url, taxRate } = req.body;
  
  try {
    // Check if a setting document exists in the collection
    let setting = await Setting.findOne();
    
    // If a setting document doesn't exist, create a new one
    if (!setting) {
      setting = new Setting({ companyName, phoneNumber, address, city, state, country, url });
    } else {
      // If a setting document exists, update its fields
      setting.companyName = companyName;
      setting.phoneNumber = phoneNumber;
      setting.address = address;
      setting.city = city;
      setting.state = state;
      setting.country = country;
      setting.url = url;
      setting.taxRate = taxRate;
    }
    
    // Saving the setting to the database
    await setting.save();
    
    // Sending a success response
    res.status(200).send('Settings updated successfully');
  } catch (error) {
    // Handling any errors that occur during the save operation
    console.error('Error updating settings:', error);
    res.status(500).send('Internal Server Error');
  }
};





const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to get settings", error: error.message });
  }
};





module.exports = {
  updateSettings,
  getSettings 
};
