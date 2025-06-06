// controllers/customerController.js
const Customer = require('../models/Customer');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
  } catch (error) {
    console.error('Error creating customer:', error); // Log the error for debugging
    res.status(400).send({
      message: 'Failed to create customer',
      error: error.message, // Send a more descriptive error message
    });
  }
};

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.send(customers);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a customer by ID
exports.updateCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a customer by ID
exports.deleteCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).send();
    }
    res.send(customer);
  } catch (error) {
    res.status(500).send(error);
  }
};




// Get customer names (primaryContactFirstName, primaryContactLastName, uniqueKey)
exports.getCustomerNames = async (req, res) => {
  try {
    const customers = await Customer.find({}, 'primaryContactFirstName primaryContactLastName uniqueKey');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer names', error: err });
  }
};

// Get customer details by uniqueKey
exports.getCustomerDetails = async (req, res) => {
  try {
    const customer = await Customer.findOne({ uniqueKey: req.params.uniqueKey });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer details', error: err });
  }
};



exports.uploadCustomer = async (req, res) => {
  const {
    name,
    primaryContactFirstName,
    primaryContactLastName,
    primaryContactEmail,
    primaryContactPhone,
    accountNumber,
    website,
    notes,
    billingCurrency,
    billingAddress1,
    billingAddress2,
    billingCountry,
    billingState,
    billingCity,
    billingPostal,
    shippingName,
    shippingAddress1,
    shippingAddress2,
    shippingCountry,
    shippingState,
    shippingCity,
    shippingPostal,
    shippingPhone,
    shippingDeliveryInstructions,
  } = req.body;

  try {
    // Check if a customer with the same email already exists
    const existingCustomer = await Customer.findOne({
      primaryContactFirstName,
    });

    if (existingCustomer) {
      // If customer exists, send a response indicating a duplicate
      return res.status(400).json({
        success: false,
        message: 'Customer with the given name already exists',
      });
    }

    // Create a new customer if no duplicate is found
    const newCustomer = new Customer({
      name,
      primaryContactFirstName,
      primaryContactLastName,
      primaryContactEmail,
      primaryContactPhone,
      accountNumber,
      website,
      notes,
      billingCurrency,
      billingAddress1,
      billingAddress2,
      billingCountry,
      billingState,
      billingCity,
      billingPostal,
      shippingName,
      shippingAddress1,
      shippingAddress2,
      shippingCountry,
      shippingState,
      shippingCity,
      shippingPostal,
      shippingPhone,
      shippingDeliveryInstructions,
    });

    // Save the new customer to the database
    await newCustomer.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: newCustomer,
    });
  } catch (error) {
    // Handle errors
    console.error('Error uploading customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
