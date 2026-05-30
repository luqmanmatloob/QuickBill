import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTimes, FaPlus, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

const CustomerManagement = () => {

  const token = localStorage.getItem('token');

  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
      setCustomers(data.data || data);
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
      setShowAddModal(false);
      setShowEditModal(false);
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
    setShowAddModal(false);
    setShowEditModal(false);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(customers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-[#384959]">Customer Management</h2>

        <div className="mb-8 border-b border-[#6D8196] pb-8">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-[#384959]">Customer List:</h3>

            {/* <li className="py-4 flex gap-5 items-center justify-between">
              <div className='flex gap-5'>
                <div className="font-semibold">Name</div>
                <div className="text-gray-600">Email</div>
                <div className="text-gray-600">Address1</div>
              </div>
            </li> */}

            <ul className="divide-y divide-[#6D8196]">
              <div className="sticky top-20 flex flex-wrap gap-3 rounded-xl border-2 border-[#6D8196] bg-[#BDDDFC] p-4">
                <div className={showCustomerDetails ? 'hidden' : 'visible'}>
                  <button onClick={toggleCustomerDetails} className="no-print flex items-center gap-2 rounded-lg border-2 border-[#6A89A7] px-3 py-1.5 text-sm font-semibold text-[#6A89A7] transition-colors duration-200 hover:bg-[#6A89A7] hover:text-white">
                    Detailed View
                  </button>
                </div>
                <div className={showCustomerDetails ? 'visible' : 'hidden'}>
                  <button type="button" className="no-print flex items-center gap-2 rounded-lg border-2 border-[#6A89A7] px-3 py-1.5 text-sm font-semibold text-[#6A89A7] transition-colors duration-200 hover:bg-[#6A89A7] hover:text-white" onClick={toggleCustomerDetails}>
                    List View
                  </button>
                </div>
                <div >
                  <button type="button" className="no-print flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-3 py-2 text-sm font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200"
                    onClick={() => {
                      clearBtn();
                      setShowAddModal(true);
                    }}
                  >
                    <FaPlus className="text-xs" />
                    <span>Add New</span>
                  </button>
                </div>
              </div>

              {currentCustomers.map((customer) => (
                <li key={customer._id} className={`flex items-center justify-between gap-5 py-4 ${showCustomerDetails ? 'flex-col' : 'flex'} `}>
                  <div>
                    <div className={`${showCustomerDetails ? 'hidden' : 'visible'} flex gap-5`}>
                      <div className="font-semibold text-[#384959]">
                        {customer.primaryContactFirstName} {customer.primaryContactLastName}
                      </div>
                      <div className="text-[#6D8196]">{customer.primaryContactEmail}</div>
                      <div className="text-[#6D8196]">{customer.billingAddress1}</div>
                    </div>

                    <div className={showCustomerDetails ? 'visible' : 'hidden'}>
                      <div className="mt-5 overflow-auto rounded-xl border-2 border-[#6D8196] bg-white p-6">
                        <div className="mb-6 flex flex-wrap items-center gap-8 lg:gap-16">
                          <div className="">
                            <div className="mb-2 text-lg font-bold uppercase text-[#384959]">Contact</div>
                            <div className="text-[#6D8196]">
                              {customer.primaryContactFirstName} {customer.primaryContactLastName}
                            </div>
                            <div className="text-[#6D8196]">{customer.primaryContactEmail}</div>
                            <div className="text-[#6D8196]">{customer.primaryContactPhone}</div>
                          </div>

                          <div className="">
                            <div className="text-lg font-bold uppercase text-[#384959]">Shipping Instructions</div>

                            <div className="max-w-md text-[#6D8196]">Shipping Instructions: {customer.shippingDeliveryInstructions}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-8 lg:gap-16">
                          <div>
                            <div className="text-lg font-bold uppercase text-[#384959]">Billing</div>
                            <div className="text-[#6D8196]">Billing Currency: {customer.billingCurrency}</div>
                            <div className="text-[#6D8196]">Billing Address 1: {customer.billingAddress1}</div>
                            <div className="text-[#6D8196]">Billing Address2: {customer.billingAddress2}</div>
                            <div className="text-[#6D8196]">Billing City: {customer.billingCity}</div>
                            <div className="text-[#6D8196]">Billing State: {customer.billingState}</div>
                            <div className="text-[#6D8196]">Billing Country: {customer.billingCountry}</div>
                            <div className="text-[#6D8196]">Billing Postal: {customer.billingPostal}</div>
                          </div>

                          <div>
                            <div className="text-lg font-bold uppercase text-[#384959]">Shipping</div>

                            <div className="text-[#6D8196]">Shipping Name: {customer.shippingName}</div>
                            <div className="text-[#6D8196]">Shipping Address1: {customer.shippingAddress1}</div>
                            <div className="text-[#6D8196]">Shipping Address2: {customer.shippingAddress2}</div>
                            <div className="text-[#6D8196]">Shipping City: {customer.shippingCity}</div>
                            <div className="text-[#6D8196]">Shipping State: {customer.shippingState}</div>
                            <div className="text-[#6D8196]">Shipping Country: {customer.shippingCountry}</div>
                            <div className="text-[#6D8196]">Shipping Postal: {customer.shippingPostal}</div>
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
                        setShowEditModal(true);
                      }}
                      className="mr-2 flex items-center gap-2 rounded-lg border-2 border-[#6A89A7] px-3 py-2 text-sm font-semibold text-[#6A89A7] hover:bg-[#6A89A7] hover:text-white transition-colors duration-200"
                    >
                      <FaEdit className="text-xs" />
                      <span>Edit</span>
                    </button>

                    <button onClick={() => deleteCustomer(customer._id)} className="mr-2 mt-1.5 flex items-center gap-2 rounded-lg border-2 border-red-400 px-3 py-2 text-sm font-semibold text-red-400 transition-colors duration-200 hover:bg-red-400 hover:text-white">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pagination */}
        {customers.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between rounded-xl border-2 border-[#6D8196] bg-[#BDDDFC] p-4">
            <div className="text-sm text-[#384959]">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, customers.length)} of {customers.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-lg border-2 border-[#6D8196] px-4 py-2 text-sm font-semibold text-[#384959] transition-all duration-200 hover:bg-[#6A89A7] hover:border-[#6A89A7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#6D8196] disabled:hover:text-[#384959]"
              >
                <FaChevronLeft className="text-xs" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      currentPage === pageNumber
                        ? 'bg-[#6A89A7] text-white shadow-md'
                        : 'border-2 border-[#6D8196] text-[#384959] hover:bg-[#6A89A7] hover:border-[#6A89A7] hover:text-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 rounded-lg border-2 border-[#6D8196] px-4 py-2 text-sm font-semibold text-[#384959] transition-all duration-200 hover:bg-[#6A89A7] hover:border-[#6A89A7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#6D8196] disabled:hover:text-[#384959]"
              >
                Next
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Customer Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[#F8FAFC] p-6 shadow-2xl border-2 border-[#6D8196]">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#384959]">
                  {editMode ? 'Edit Customer' : 'Add New Customer'}
                </h3>
                <button
                  onClick={clearBtn}
                  className="rounded-lg border-2 border-[#6D8196] p-2 text-[#6D8196] hover:border-red-400 hover:text-red-400 transition-colors duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Contact Information */}
              <div className="mb-8 border-b border-[#6D8196] pb-8">
                <h4 className="mb-4 text-xl font-bold text-[#384959]">Contact Information:</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">First Name:</label>
                    <input type="text" name="primaryContactFirstName" value={newCustomer.primaryContactFirstName} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Last Name:</label>
                    <input type="text" name="primaryContactLastName" value={newCustomer.primaryContactLastName} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Email:</label>
                    <input type="email" name="primaryContactEmail" value={newCustomer.primaryContactEmail} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Phone:</label>
                    <input type="tel" name="primaryContactPhone" value={newCustomer.primaryContactPhone} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Website:</label>
                    <input type="text" name="website" value={newCustomer.website} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Personal Note:</label>
                    <textarea name="notes" value={newCustomer.notes} onChange={handleInputChange} rows="3" className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-3 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none resize-none" />
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div className="mb-8 border-b border-[#6D8196] pb-8">
                <h4 className="mb-4 text-xl font-bold text-[#384959]">Billing Information:</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Currency:</label>
                    <input type="text" name="billingCurrency" value={newCustomer.billingCurrency} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Billing Address:</label>
                    <input type="text" name="billingAddress1" value={newCustomer.billingAddress1} onChange={handleInputChange} placeholder="Address Line 1" className="mb-2 w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    <input type="text" name="billingAddress2" value={newCustomer.billingAddress2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">City:</label>
                    <input type="text" name="billingCity" value={newCustomer.billingCity} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">State:</label>
                    <input type="text" name="billingState" value={newCustomer.billingState} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Postal Code:</label>
                    <input type="text" name="billingPostal" value={newCustomer.billingPostal} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Country:</label>
                    <input type="text" name="billingCountry" value={newCustomer.billingCountry} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="mb-8">
                <h4 className="mb-4 text-xl font-bold text-[#384959]">Shipping Information:</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Name:</label>
                    <input type="text" name="shippingName" value={newCustomer.shippingName} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Shipping Address:</label>
                    <input type="text" name="shippingAddress1" value={newCustomer.shippingAddress1} onChange={handleInputChange} placeholder="Address Line 1" className="mb-2 w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    <input type="text" name="shippingAddress2" value={newCustomer.shippingAddress2} onChange={handleInputChange} placeholder="Address Line 2" className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">City:</label>
                    <input type="text" name="shippingCity" value={newCustomer.shippingCity} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">State:</label>
                    <input type="text" name="shippingState" value={newCustomer.shippingState} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Postal Code:</label>
                    <input type="text" name="shippingPostal" value={newCustomer.shippingPostal} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Country:</label>
                    <input type="text" name="shippingCountry" value={newCustomer.shippingCountry} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Phone:</label>
                    <input type="tel" name="shippingPhone" value={newCustomer.shippingPhone} onChange={handleInputChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Delivery Instructions:</label>
                    <textarea name="shippingDeliveryInstructions" value={newCustomer.shippingDeliveryInstructions} onChange={handleInputChange} rows="3" className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-3 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none resize-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button onClick={clearBtn} className="rounded-lg border-2 border-[#6D8196] px-6 py-2.5 font-semibold text-[#384959] hover:bg-[#BDDDFC] hover:border-[#6A89A7] hover:text-[#384959] transition-colors duration-200">
                  Cancel
                </button>
                <button onClick={saveCustomer} className="rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-6 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200">
                  {editMode ? 'Update' : 'Add'} Customer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
