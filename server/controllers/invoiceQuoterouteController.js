
// const Note = require('../models/');

// Create a new note

exports.createInvoiceQuoteroute = async (req, res) => {
  console.log(req.body)
    res.status(200).send("Invoice or quote created successfully");
  };
  


  exports.getInvoiceQuoterouteById = async (req, res) => {
    res.status(200).send("Invoice or quote get by id successfully");
  };
  


  exports.updateInvoiceQuoteroute = async (req, res) => {
    res.status(200).send("Invoice or quote updated successfully");
  };
  


  exports.deleteInvoiceQuoteroute = async (req, res) => {
    res.status(200).send("Invoice or quote deleted successfully");
  };
  