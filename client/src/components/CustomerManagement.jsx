// components/CustomerManagement.js
import React, { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000'; // Adjust port as per your backend setup

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    primaryContact: { firstName: '', lastName: '', email: '', phone: '' },
    accountNumber: '',
    website: '',
    notes: '',
    billing: { currency: '', address: { address1: '', address2: '', country: '', state: '', city: '', postal: '' } },
    shipping: { name: '', address: { address1: '', address2: '', country: '', state: '', city: '', postal: '' }, phone: '', deliveryInstructions: '' },
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('contact'); // Default tab

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/customerroute`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prevCustomer => ({
      ...prevCustomer,
      [activeTab]: {
        ...prevCustomer[activeTab],
        [name]: value
      }
    }));
  };

  // Save or update customer
  const saveCustomer = async () => {
    try {
      let response;
      if (editMode) {
        response = await fetch(`${BASE_URL}/api/customerroute/${selectedCustomerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomer),
        });
      } else {
        response = await fetch(`${BASE_URL}/api/customerroute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCustomer),
        });
      }
      if (!response.ok) {
        throw new Error('Failed to save customer');
      }
      setNewCustomer({
        name: '',
        primaryContact: { firstName: '', lastName: '', email: '', phone: '' },
        accountNumber: '',
        website: '',
        notes: '',
        billing: { currency: '', address: { address1: '', address2: '', country: '', state: '', city: '', postal: '' } },
        shipping: { name: '', address: { address1: '', address2: '', country: '', state: '', city: '', postal: '' }, phone: '', deliveryInstructions: '' },
      });
      setEditMode(false);
      fetchCustomers(); // Refresh customer list
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  // Edit customer
  const editCustomer = (customer) => {
    setNewCustomer(customer);
    setSelectedCustomerId(customer._id); // Assuming your customer object has an _id field
    setEditMode(true);
  };

  // Delete customer
  const deleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/customerroute/${customerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      fetchCustomers(); // Refresh customer list
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div 
    // className="max-w-4xl mx-auto p-4 bg-white w-[100vw]"
    className="max-w-4xl  min-h-screen mx-auto bg-white rounded-lg shadow-2xl p-8 border-b-slate-300 border-solid border-2 border-r-[#6539c0] border-l-[#6539c0]"

    >
      <h2 className="text-2xl font-bold mb-4">Customer Management</h2>
  
      {/* Tabs */}
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg focus:outline-none ${activeTab === 'contact' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleTabChange('contact')}
          >
            Contact
          </button>
          <button
            className={`px-4 py-2 rounded-lg focus:outline-none ${activeTab === 'billing' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleTabChange('billing')}
          >
            Billing
          </button>
          <button
            className={`px-4 py-2 rounded-lg focus:outline-none ${activeTab === 'shipping' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleTabChange('shipping')}
          >
            Shipping
          </button>
          <button
            className={`px-4 py-2 rounded-lg focus:outline-none ${activeTab === 'more' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => handleTabChange('more')}
          >
            More
          </button>
        </div>
      </div>
  
      {/* Tab Content */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg">
        {activeTab === 'contact' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Information:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  value={newCustomer.primaryContact.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  value={newCustomer.primaryContact.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  required
                />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newCustomer.primaryContact.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  required
                />
              </div>
              <div className="mb-4 col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={newCustomer.primaryContact.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                  required
                />
              </div>
            </div>
          </div>
        )}
  
        {activeTab === 'billing' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Billing Information:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Currency:</label>
                <input
                  type="text"
                  name="currency"
                  value={newCustomer.billing.currency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                />
              </div>
              <div className="col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Billing Address:</label>
                <input
                  type="text"
                  name="address1"
                  value={newCustomer.billing.address.address1}
                  onChange={handleInputChange}
                  placeholder="Address Line 1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                />
                <input
                  type="text"
                  name="address2"
                  value={newCustomer.billing.address.address2}
                  onChange={handleInputChange}
                  placeholder="Address Line 2"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
                <input
                  type="text"
                  name="country"
                  value={newCustomer.billing.address.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
                <input
                  type="text"
                  name="state"
                  value={newCustomer.billing.address.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
                <input
                  type="text"
                  name="city"
                  value={newCustomer.billing.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
                <input
                  type="text"
                  name="postal"
                  value={newCustomer.billing.address.postal}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
              </div>
            </div>
          </div>
        )}
  
        {activeTab === 'shipping' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Shipping Information:</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={newCustomer.shipping.name}
                onChange={handleInputChange}
                className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={newCustomer.shipping.phone}
                  onChange={handleInputChange}
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                />
              </div>
              <div className="col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Shipping Address:</label>
                <input
                  type="text"
                  name="address1"
                  value={newCustomer.shipping.address.address1}
                  onChange={handleInputChange}
                  placeholder="Address Line 1"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
                />
                <input
                  type="text"
                  name="address2"
                  value={newCustomer.shipping.address.address2}
                  onChange={handleInputChange}
                  placeholder="Address Line 2"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
                <input
                  type="text"
                  name="country"
                  value={newCustomer.shipping.address.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
                <input
                  type="text"
                  name="state"
                  value={newCustomer.shipping.address.state}
                  onChange={handleInputChange}
                  placeholder="State"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
                <input
                  type="text"
                  name="city"
                  value={newCustomer.shipping.address.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
                <input
                  type="text"
                  name="postal"
                  value={newCustomer.shipping.address.postal}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-2 h-10"
                />
              </div>
              <div className="col-span-2 mb-4">
                <label className="block text-sm font-medium text-gray-700">Delivery Instructions:</label>
                <textarea
                  name="deliveryInstructions"
                  value={newCustomer.shipping.deliveryInstructions}
                  onChange={handleInputChange}
                  rows="3"
                  className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
  
        {activeTab === 'more' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">More Details:</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Account Number:</label>
              <input
                type="text"
                name="accountNumber"
                value={newCustomer.accountNumber}
                onChange={handleInputChange}
                className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Website:</label>
              <input
                type="text"
                name="website"
                value={newCustomer.website}
                onChange={handleInputChange}
                className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-10"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Notes:</label>
              <textarea
                name="notes"
                value={newCustomer.notes}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>
  
      {/* Customer List */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Customers:</h3>
        <ul className="divide-y divide-gray-200 rounded-lg">
          {customers.map((customer) => (
            <li key={customer._id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-semibold">{customer.name}</div>
                <div className="text-sm text-gray-600">{customer.primaryContact.email}</div>
              </div>
              <div>
                <button
                  className="text-blue-600 hover:text-blue-900 mr-2 focus:outline-none"
                  onClick={() => editCustomer(customer)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-900 focus:outline-none"
                  onClick={() => deleteCustomer(customer._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  };

export default CustomerManagement;
