import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const CustomerManagement = () => {
  
  const token = localStorage.getItem('token');

  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    primaryContactFirstName: '',
    primaryContactLastName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    accountNumber: '',
    website: '',
    notes: '',
    billingCurrency: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCountry: '',
    billingState: '',
    billingCity: '',
    billingPostal: '',
    shippingName: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCountry: '',
    shippingState: '',
    shippingCity: '',
    shippingPostal: '',
    shippingPhone: '',
    shippingDeliveryInstructions: ''
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  // const handleCheckboxChange = (e) => {
  //   if (e.target.checked) {
  //     populateShippingFromBilling();
  //   } else {
  //     clearShippingFields();
  //   }
  // };

  // const populateShippingFromBilling = () => {
  //   setNewCustomer((prevCustomer) => ({
  //     ...prevCustomer,
  //     shippingName: '',
  //     shippingAddress1: prevCustomer.billingAddress1,
  //     shippingAddress2: prevCustomer.billingAddress2,
  //     shippingCity: prevCustomer.billingCity,
  //     shippingState: prevCustomer.billingState,
  //     shippingPostal: prevCustomer.billingPostal,
  //     shippingCountry: prevCustomer.billingCountry,
  //     shippingPhone: '',
  //     shippingDeliveryInstructions: '',
  //   }));
  // };

  // const clearShippingFields = () => {
  //   setNewCustomer((prevCustomer) => ({
  //     ...prevCustomer,
  //     shippingAddress1: '',
  //     shippingAddress2: '',
  //     shippingCity: '',
  //     shippingState: '',
  //     shippingPostal: '',
  //     shippingCountry: '',
  //     shippingPhone: '',
  //     shippingDeliveryInstructions: '',
  //   }));
  // };

  const toggleCustomerDetails = () => {
    if (showCustomerDetails) {
      setShowCustomerDetails(false);
    } else {
      setShowCustomerDetails(true);
    }
  };

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/customer`,
        {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in header
          }
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      setCustomers(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: value
    });
  };

  // Save or update customer
  const saveCustomer = async () => {
    if (newCustomer.primaryContactFirstName === '') {
      window.alert('Invalid first name');
      return;
    }

    try {
      let response;
      if (editMode) {
        response = await fetch(`${BASE_URL}/api/customer/${selectedCustomerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in header


          },
          body: JSON.stringify(newCustomer)
        });
      } else {
        response = await fetch(`${BASE_URL}/api/customer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include token in header

          },
          body: JSON.stringify(newCustomer)
        });
      }
      if (!response.ok) {
        throw new Error('Failed to save customer');
      }
      setEditMode(false);
      clearBtn();
      fetchCustomers(); // Refresh customer list
      window.alert('Customer Added Successfully');
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  // Delete customer
  const deleteCustomer = async (customerId) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete this item?`);
    if (!isConfirmed) {
      return; // If the user cancels, do nothing
    }

    try {
      const response = await fetch(`${BASE_URL}/api/customer/${customerId}`, {
        method: 'DELETE'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}` // Include token in header
        }
      }
    );
      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }
      fetchCustomers(); // Refresh customer list
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const clearBtn = () => {
    setEditMode(false);
    setNewCustomer({
      name: '',
      primaryContactFirstName: '',
      primaryContactLastName: '',
      primaryContactEmail: '',
      primaryContactPhone: '',
      accountNumber: '0000',
      website: '',
      notes: '',
      billingCurrency: '',
      billingAddress1: '',
      billingAddress2: '',
      billingCountry: '',
      billingState: '',
      billingCity: '',
      billingPostal: '',
      shippingName: '',
      shippingAddress1: '',
      shippingAddress2: '',
      shippingCountry: '',
      shippingState: '',
      shippingCity: '',
      shippingPostal: '',
      shippingPhone: '',
      shippingDeliveryInstructions: ''
    });
  };

  return (
    <div className="ml-40 mt-16">
      <div className="mx-auto min-h-screen max-w-4xl rounded-lg border-2 border-solid border-[#f1f1f1] border-b-slate-300 border-l-[#d1e4f5] border-r-[#d1e4f5] bg-white p-8 shadow-xl">
        <h2 className="mb-4 text-center text-2xl font-bold text-[#2b6bb9]">Customer Management</h2>

        <div className="mb-20 mt-16 flex justify-center border-b-4 border-blue-300">
          <div className="mt-8">
            <h3 className="mb-4 text-2xl font-bold text-[#2b6bb9]">Customer List:</h3>

            {/* <li className="py-4 flex gap-5 items-center justify-between">
              <div className='flex gap-5'>
                <div className="font-semibold">Name</div>
                <div className="text-gray-600">Email</div>
                <div className="text-gray-600">Address1</div>
              </div>
            </li> */}

            <ul className="divide-y divide-gray-200">
              <div className="sticky top-20 flex gap-3 rounded-md border-2 border-blue-100 bg-[#F5FAFF] px-7">
                <div className={showCustomerDetails ? 'hidden' : 'visible'}>
                  <button onClick={toggleCustomerDetails} className="no-print py- my-2 rounded border-[1px] border-blue-500 bg-transparent px-4 font-semibold text-blue-700 hover:bg-blue-200 hover:text-black">
                    Detailed View
                  </button>
                </div>
                <div className={showCustomerDetails ? 'visible' : 'hidden'}>
                  <button type="button" className="no-print py- my-2 rounded border-[1px] border-blue-500 bg-transparent px-4 font-semibold text-blue-700 hover:bg-blue-200 hover:text-black" onClick={toggleCustomerDetails}>
                    List View
                  </button>
                </div>
                <div >
                  <button type="button" className="no-print py- my-2 rounded border-[1px] border-blue-500 bg-transparent px-4 font-semibold text-blue-700 hover:bg-blue-200 hover:text-black"
                    onClick={() => {
                      const offsetFromBottom = 2100;
                      const scrollPosition = document.documentElement.scrollHeight - window.innerHeight - offsetFromBottom;
                      window.scrollTo({
                        top: scrollPosition,
                        behavior: 'smooth'
                      });
                    }}
                  >

                    Add New
                  </button>
                </div>
              </div>

              {customers.map((customer) => (
                <li key={customer._id} className={`flex items-center justify-between gap-5 py-4 ${showCustomerDetails ? 'flex-col' : 'flex'} `}>
                  <div>
                    <div className={`${showCustomerDetails ? 'hidden' : 'visible'} flex gap-5`}>
                      <div className="font-semibold">
                        {customer.primaryContactFirstName} {customer.primaryContactLastName}
                      </div>
                      <div className="text-gray-600">{customer.primaryContactEmail}</div>
                      <div className="text-gray-600">{customer.billingAddress1}</div>
                    </div>

                    <div className={showCustomerDetails ? 'visible' : 'hidden'}>
                      <div className="border- bottom-14 mt-5 overflow-auto rounded-lg border-solid border-b-slate-300 border-l-blue-300 border-r-blue-300 bg-white p-10">
                        <div className="justify- my-5 flex items-center gap-32">
                          <div className="">
                            <div className="mb-2 text-xl font-semibold uppercase text-black">Contact </div>
                            <div className="text-gray-600">
                              {customer.primaryContactFirstName} {customer.primaryContactLastName}
                            </div>
                            <div className="text-gray-600">{customer.primaryContactEmail}</div>
                            <div className="text-gray-600">{customer.primaryContactPhone}</div>
                          </div>

                          <div className="">
                            <div className="text-xl font-semibold uppercase text-black">Shipping Instructions </div>

                            <div className="max-w-md text-gray-600">Shipping Instructions: {customer.shippingDeliveryInstructions}</div>
                          </div>
                        </div>

                        <div className="justify- my-5 flex items-center gap-[90px]">
                          <div>
                            <div className="text-xl font-semibold uppercase text-black">Billing </div>
                            <div className="text-gray-600">Billing Currency: {customer.billingCurrency}</div>
                            <div className="text-gray-600">Billing Address 1: {customer.billingAddress1}</div>
                            <div className="text-gray-600">Billing Address2: {customer.billingAddress2}</div>
                            <div className="text-gray-600">Billing City: {customer.billingCity}</div>
                            <div className="text-gray-600">Billing State: {customer.billingState}</div>
                            <div className="text-gray-600">Billing Country: {customer.billingCountry}</div>
                            <div className="text-gray-600">Billing Postal: {customer.billingPostal}</div>
                          </div>

                          <div>
                            <div className="text-xl font-semibold uppercase text-black">Shipping </div>

                            <div className="text-gray-600">Shipping Name: {customer.shippingName}</div>
                            <div className="text-gray-600">Shipping Address1: {customer.shippingAddress1}</div>
                            <div className="text-gray-600">Shipping Address2: {customer.shippingAddress2}</div>
                            <div className="text-gray-600">Shipping City: {customer.shippingCity}</div>
                            <div className="text-gray-600">Shipping State: {customer.shippingState}</div>
                            <div className="text-gray-600">Shipping Country: {customer.shippingCountry}</div>
                            <div className="text-gray-600">Shipping Postal: {customer.shippingPostal}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setSelectedCustomerId(customer._id);
                        setNewCustomer({
                          ...customer,
                          primaryContactFirstName: customer.primaryContactFirstName || '',
                          primaryContactLastName: customer.primaryContactLastName || '',
                          primaryContactEmail: customer.primaryContactEmail || '',
                          primaryContactPhone: customer.primaryContactPhone || '',
                          accountNumber: customer.accountNumber || '',
                          website: customer.website || '',
                          notes: customer.notes || '',
                          billingCurrency: customer.billingCurrency || '',
                          billingAddress1: customer.billingAddress1 || '',
                          billingAddress2: customer.billingAddress2 || '',
                          billingCountry: customer.billingCountry || '',
                          billingState: customer.billingState || '',
                          billingCity: customer.billingCity || '',
                          billingPostal: customer.billingPostal || '',
                          shippingName: customer.shippingName || '',
                          shippingAddress1: customer.shippingAddress1 || '',
                          shippingAddress2: customer.shippingAddress2 || '',
                          shippingCountry: customer.shippingCountry || '',
                          shippingState: customer.shippingState || '',
                          shippingCity: customer.shippingCity || '',
                          shippingPostal: customer.shippingPostal || '',
                          shippingPhone: customer.shippingPhone || '',
                          shippingDeliveryInstructions: customer.shippingDeliveryInstructions || ''
                        });

                        const offsetFromBottom = 2100;
                        const scrollPosition = document.documentElement.scrollHeight - window.innerHeight - offsetFromBottom;

                        window.scrollTo({
                          top: scrollPosition,
                          behavior: 'smooth'
                        });
                      }}
                      className="mr-2 rounded bg-blue-400 px-3 py-1 font-bold text-white hover:bg-blue-500"
                    >
                      Edit
                    </button>

                    <button onClick={() => deleteCustomer(customer._id)} className="hover:red m-1 rounded border-[1px] border-gray-900 px-4 py-1 font-bold text-gray-900 hover:border-red-400 hover:text-red-500">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-10 border-b-4 border-blue-300 bg-white p-4 pb-10">
          <h3 className="mb-2 text-lg font-semibold">Contact Information:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">First Name:</label>
              <input type="text" name="primaryContactFirstName" value={newCustomer.primaryContactFirstName} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input type="text" name="primaryContactLastName" value={newCustomer.primaryContactLastName} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input type="email" name="primaryContactEmail" value={newCustomer.primaryContactEmail} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input type="tel" name="primaryContactPhone" value={newCustomer.primaryContactPhone} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Website:</label>
              <input type="text" name="website" value={newCustomer.website} onChange={handleInputChange} className="block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Personal Note:</label>
              <textarea name="notes" value={newCustomer.notes} onChange={handleInputChange} rows="3" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="mb-10 border-b-4 border-blue-300 bg-white p-4 pb-10">
          <h3 className="mb-2 text-lg font-semibold">Billing Information:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Currency:</label>
              <input type="text" name="billingCurrency" value={newCustomer.billingCurrency} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Billing Address:</label>
              <input type="text" name="billingAddress1" value={newCustomer.billingAddress1} onChange={handleInputChange} placeholder="Address Line 1" className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              <input type="text" name="billingAddress2" value={newCustomer.billingAddress2} onChange={handleInputChange} placeholder="Address Line 2" className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">City:</label>
              <input type="text" name="billingCity" value={newCustomer.billingCity} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">State:</label>
              <input type="text" name="billingState" value={newCustomer.billingState} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">Postal Code:</label>
              <input type="text" name="billingPostal" value={newCustomer.billingPostal} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Country:</label>
              <input type="text" name="billingCountry" value={newCustomer.billingCountry} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        {/* 

        <div className="mb-4 col-span-2">
          <input
            type="checkbox"
            id="sameAsBilling"
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="sameAsBilling" className="text-sm font-medium text-gray-700">Same as Billing</label>
        </div>
        <button
          onClick={populateShippingFromBilling}
          className="px-2 py-1 bg-blue-300 text-white font-semibold rounded-md hover:bg-blue-400"
        >
          Same as Billing
        </button>
 */}

        {/* Shipping Information */}
        <div className="bg-white p-4">
          <h3 className="mb-2 text-lg font-semibold">Shipping Information:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input type="text" name="shippingName" value={newCustomer.shippingName} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Shipping Address:</label>
              <input type="text" name="shippingAddress1" value={newCustomer.shippingAddress1} onChange={handleInputChange} placeholder="Address Line 1" className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              <input type="text" name="shippingAddress2" value={newCustomer.shippingAddress2} onChange={handleInputChange} placeholder="Address Line 2" className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">City:</label>
              <input type="text" name="shippingCity" value={newCustomer.shippingCity} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">State:</label>
              <input type="text" name="shippingState" value={newCustomer.shippingState} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-1 mb-4">
              <label className="block text-sm font-medium text-gray-700">Postal Code:</label>
              <input type="text" name="shippingPostal" value={newCustomer.shippingPostal} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Country:</label>
              <input type="text" name="shippingCountry" value={newCustomer.shippingCountry} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input type="tel" name="shippingPhone" value={newCustomer.shippingPhone} onChange={handleInputChange} className="mt-1 block h-10 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700">Delivery Instructions:</label>
              <textarea name="shippingDeliveryInstructions" value={newCustomer.shippingDeliveryInstructions} onChange={handleInputChange} rows="3" className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
        </div>

        <div className="mr-6 flex justify-end">
          <button onClick={clearBtn} className="py- mr-1 rounded-md border-2 border-blue-500 px-4 font-bold text-blue-500 hover:bg-blue-50">
            Clear
          </button>
          <button onClick={saveCustomer} className="mx-2 rounded-md border-2 border-blue-300 bg-gradient-to-l from-blue-300 to-blue-200 px-2 py-2 font-semibold text-gray-800 hover:scale-105 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none active:text-black">
            {editMode ? 'Update' : 'Add'} Customer
          </button>
        </div>
      </div >
    </div >
  );
};

export default CustomerManagement;
