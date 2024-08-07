// routes/customers.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Create a new customer
router.post("/", customerController.createCustomer);

router.post("/uploadCustomer", customerController.uploadCustomer);


// Get customer names
router.get("/names", customerController.getCustomerNames);

// Get all customers
router.get("/", customerController.getAllCustomers);

// Get a customer by ID
router.get("/:id", customerController.getCustomerById);

// Update a customer by ID
router.put("/:id", customerController.updateCustomerById);

// Delete a customer by ID
router.delete("/:id", customerController.deleteCustomerById);

// Get customer details by unique key
router.get("/details/:uniqueKey", customerController.getCustomerDetails);

module.exports = router;
