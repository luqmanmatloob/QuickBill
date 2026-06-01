import React from 'react';
import Company from './Company';

import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import {getNextOrderNumber} from './helpers/helperFunctions'

import { RiArrowDropDownLine } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa6';
import { TiTick } from 'react-icons/ti';

const Invoice = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const token = localStorage.getItem('token');



  const [subtotal, setSubtotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [responseMessage, setResponseMessage] = useState('');
  const [invoiceNoLbl, setinvoiceNoLbl] = useState('Invoice No');
  const [editPayments, setEditPayments] = useState(false);
  const [totalPayments, setTotalPayments] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [taxRate, setTaxRate] = useState();
  const [uniqueKey, setUniqueKey] = useState();

  const [codeName, setCodeName] = useState('');

  const [visiblePopupIndex, setVisiblePopupIndex] = useState(null);
  const [sizeQtyToggle, setSizeQtyToggle] = useState(false);

  const [formData, setFormData] = useState({
    type: 'invoice',
    orderNumber: '',
    dateOrdered: '',
    dateDue: '',
    orderTotal: 0,
    billingFirstName: '',
    billingLastName: '',
    billingCity: '',
    billingAddress: '',
    billingState: '',
    billingEmailAddress: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingMethod: '',
    paymentMethod: '',
    shippingAddress: '',
    shippingState: '',
    shippingPostcod: '',
    paymentPaid: '',
    paymentDue: '',
    paymentTerms: '',
    paymentDates: '',

    items: [
      {
        orderNumber: '',
        productName: '',
        productCode: '',
        size: '',
        color: '',
        lineQty: 1,
        decorationProcess: '',
        unitPrice: 0,
        lineTotal: 0,
        tax: 0,
        taxExempt: false,
        orderShippingTotal: 0,
        poNumber: '',
        supplierPoNumber: '',
        productionStaffAccount: '',
        storeName: '',
        company: '',
        billingFirstName: '',
        billingLastName: '',
        billingEmailAddress: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingPostcode: '',
        billingPhoneNo: '',
        shippingFirstName: '',
        shippingLastName: '',
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingPostcode: '',
        shippingPhoneNo: '',
        shippingMethod: '',
        designName: '',
        designPrice: 0,

        // Size fields for each size
        sQty: 0,
        sPrice: 0,
        sTotal: 0,

        mQty: 0,
        mPrice: 0,
        mTotal: 0,

        lQty: 0,
        lPrice: 0,
        lTotal: 0,

        xlQty: 0,
        xlPrice: 0,
        xlTotal: 0,

        '2xlQty': 0,
        '2xlPrice': 0,
        '2xlTotal': 0,

        '3xlQty': 0,
        '3xlPrice': 0,
        '3xlTotal': 0,

        '4xlQty': 0,
        '4xlPrice': 0,
        '4xlTotal': 0,

        '5xlQty': 0,
        '5xlPrice': 0,
        '5xlTotal': 0
      }
    ],
    payments: [
      {
        datePaid: '',
        outstandingOrderBalance: 0,
        orderPaymentAmount: 0,
        totalPaymentAmount: 0,
        refundedAmount: 0,
        paymentMethod: '',
        paymentStatus: '' //paid or not
      }
    ],
    note: 'Note here'
  });

  // ##############################################



// to populate invoiceNumber/orderNumber with next order number after highest existing highest number
  useEffect(() => {
    const fetchOrderNumber = async () => {
      console.log('fetching next invoice number is running ')
      try {
        const nextOrderNumber = await getNextOrderNumber(BASE_URL, token);
        // console.log( ` nextorder number ${nextOrderNumber}`)

        const updatedFormData = {
          ...formData,
          orderNumber: nextOrderNumber,
        };
        setFormData(updatedFormData);
      
    
      } catch (error) {
        console.error('Error fetching the next order number:', error);
      }
    };

    fetchOrderNumber();
  }, []);




  // to toggle invoice and quote in dropdown
  useEffect(() => {
    if (formData.type === 'invoice') {
      setinvoiceNoLbl('Invoice No');
    } else if (formData.type === 'quote') {
      setinvoiceNoLbl('Quote No');
    }
  }, [formData.type]);

  // fetching settings to get taxrate on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch customer names on component mount
  useEffect(() => {
    fetch(`${BASE_URL}/api/customer/names`,
      {
        headers: {
          'Authorization': `Bearer ${token}` // Include token in header
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        } else {
          console.error('Expected an array but got:', data);
        }
      })
      .catch((error) => console.error('Error fetching customer names:', error));
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, grandTotal, formData.paymentPaid]);

  // ##############################################

  // function to fetch settings for taxrate
  const fetchSettings = async () => {
    try {

      const response = await fetch(`${BASE_URL}/api/settings`,
        {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in header
          }
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setTaxRate(data.taxRate);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // function to fetch and populate billing and shipping when user clicks on customer name
  const populateCustomer = (uniqueKey) => {
    fetch(`${BASE_URL}/api/customer/details/${uniqueKey}`,
      {
        headers: {
          'Authorization': `Bearer ${token}` // Include token in header
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Extract relevant shipping and billing details from the customer data
        const { primaryContactFirstName, primaryContactLastName, primaryContactEmail, primaryContactPhone, billingAddress1, billingAddress2, billingCity, billingState, billingCountry, billingPostal, shippingName, shippingAddress1, shippingAddress2, shippingCity, shippingState, shippingCountry, shippingPostal, shippingPhone, shippingDeliveryInstructions } = data;

        // Update the formData with the extracted details
        setFormData((prevFormData) => ({
          ...prevFormData,
          billingFirstName: `${primaryContactFirstName}`,
          billingLastName: `${primaryContactLastName}`,
          billingCity,
          billingAddress: `${billingAddress1}`,
          billingState,
          billingEmailAddress: primaryContactEmail,
          shippingFirstName: shippingName,
          shippingAddress: `${shippingAddress1}`,
          shippingCity,
          shippingState,
          shippingPostcode: shippingPostal
          // Populate other fields if necessary
        }));

        // Close the popup after updating the form data
        setIsPopupOpen(false);
      })
      .catch((error) => console.error('Error fetching customer details:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    console.log(formData);
  };

  // funciton to remove and item
  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
  };

  const handleItemChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedItems = [...formData.items];
    const key = name.replace(`items[${index}].`, '');

    // Handle checkbox separately
    if (type === 'checkbox') {
      updatedItems[index] = { ...updatedItems[index], [key]: checked };
    } else {
      updatedItems[index] = { ...updatedItems[index], [key]: value };
    }

    // Auto-calculate lineTotal if unitPrice, lineQty, or tax changes
    if (['unitPrice', 'lineQty', 'taxExempt'].includes(key)) {
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      const lineQty = parseInt(updatedItems[index].lineQty) || 0;

      let [lineSubtotal, totalQty] = (() => {
        const quantities = [updatedItems[index].sQty, updatedItems[index].mQty, updatedItems[index].lQty, updatedItems[index].xlQty, updatedItems[index]['2xlQty'], updatedItems[index]['3xlQty'], updatedItems[index]['4xlQty'], updatedItems[index]['5xlQty']].map((qty) => Number(qty));

        const prices = [updatedItems[index].sPrice, updatedItems[index].mPrice, updatedItems[index].lPrice, updatedItems[index].xlPrice, updatedItems[index]['2xlPrice'], updatedItems[index]['3xlPrice'], updatedItems[index]['4xlPrice'], updatedItems[index]['5xlPrice']].map((price) => Number(price));

        const weightedSum = quantities.reduce((acc, qty, i) => acc + qty * prices[i], 0);
        const totalQty = quantities.reduce((acc, qty) => acc + qty, 0);

        return [weightedSum, totalQty];
      })();

      if (totalQty > 0) {
        let avgUnitPrice = lineSubtotal / totalQty;
        if (updatedItems[index].unitPrice !== avgUnitPrice.toFixed(1)) {
          updatedItems[index].unitPrice = avgUnitPrice.toFixed(1);
          updatedItems[index].lineQty = totalQty;
        }
      }

      // Calculate tax using the global taxRate variable
      const tax = unitPrice * lineQty * (taxRate / 100);
      updatedItems[index].tax = tax.toFixed(1);

      const taxExempt = updatedItems[index].taxExempt;
      let lineTotal = lineQty * unitPrice;
      lineTotal = taxExempt ? lineTotal : lineTotal + tax;
      updatedItems[index].lineTotal = lineTotal;
    }

    const updatedFormData = { ...formData, items: updatedItems };
    setFormData(updatedFormData);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    formData.items.forEach((item) => {
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const lineQty = parseInt(item.lineQty) || 0;
      const lineTotal = unitPrice * lineQty;
      const tax = parseFloat(item.tax) || 0;
      const taxExempt = item.taxExempt;
      const taxAmount = taxExempt ? 0 : tax;
      if (taxExempt) {
        item.tax = 0;
      }

      subtotal += lineTotal;
      totalTax += taxAmount;
    });
    setSubtotal(subtotal);
    setTotalTax(totalTax);
    setGrandTotal(subtotal + totalTax);

    const computedOrderTotal = grandTotal;

    let paymentDue = (grandTotal - formData.paymentPaid).toFixed(1);

    const updatedFormData = {
      ...formData,
      orderTotal: computedOrderTotal,
      paymentDue: paymentDue
    };
    setFormData(updatedFormData);
  };

  const addItem = () => {
    const newItems = [
      ...formData.items,
      {
        orderNumber: '',
        productName: '',
        productCode: '',
        size: '',
        color: '',
        lineQty: 1,
        decorationProcess: '',
        unitPrice: 0,
        lineTotal: 0,
        tax: 0,
        taxExempt: false,
        orderShippingTotal: 0,
        poNumber: '',
        supplierPoNumber: '',
        productionStaffAccount: '',
        storeName: '',
        company: '',
        billingFirstName: '',
        billingLastName: '',
        billingEmailAddress: '',
        billingAddress: '',
        billingCity: '',
        billingState: '',
        billingPostcode: '',
        billingPhoneNo: '',
        shippingFirstName: '',
        shippingLastName: '',
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingPostcode: '',
        shippingPhoneNo: '',
        shippingMethod: '',
        designName: '',
        designPrice: 0,

        sQty: 0,
        sPrice: 0,
        sTotal: 0,

        mQty: 0,
        mPrice: 0,
        mTotal: 0,

        lQty: 0,
        lPrice: 0,
        lTotal: 0,

        xlQty: 0,
        xlPrice: 0,
        xlTotal: 0,

        '2xlQty': 0,
        '2xlPrice': 0,
        '2xlTotal': 0,

        '3xlQty': 0,
        '3xlPrice': 0,
        '3xlTotal': 0,

        '4xlQty': 0,
        '4xlPrice': 0,
        '4xlTotal': 0,

        '5xlQty': 0,
        '5xlPrice': 0,
        '5xlTotal': 0
      }
    ];

    const updatedFormData = { ...formData, items: newItems };
    setFormData(updatedFormData);
  };

  useEffect(() => {
    let totalPaymentPaid = 0;
    let paymentDates = '';
    let paymentMethod = '';

    formData.payments.forEach((payment, index) => {
      totalPaymentPaid += Number(payment.orderPaymentAmount); // Convert to number

      // Convert date to American format (MM/DD/YYYY)
      const date = new Date(payment.datePaid);
      if (!isNaN(date)) {
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        paymentDates += `${formattedDate}, `;
      }

      paymentMethod += `${payment.paymentMethod}, `;
    });

    // Remove trailing comma and space
    paymentDates = paymentDates.slice(0, -2);
    paymentMethod = paymentMethod.slice(0, -2);

    setFormData((prevFormData) => ({
      ...prevFormData,
      paymentPaid: totalPaymentPaid,
      paymentDates: paymentDates,
      paymentMethod: paymentMethod
    }));

    console.log(formData.paymentDates);
    console.log(formData.paymentMethod);
    console.log(formData.paymentPaid);
  }, [editPayments]);

  const handlePaymentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPayments = [...formData.payments];
    const key = name.replace(`payments[${index}].`, '');

    updatedPayments[index] = {
      ...updatedPayments[index],
      [key]: value
    };

    const updatedFormData = { ...formData, payments: updatedPayments };
    setFormData(updatedFormData);
    console.log(updatedFormData);
  };

  const addPayment = () => {
    const newPayment = {
      amount: '',
      date: '',
      method: '',
      reference: '',
      note: '',
      otherType: '',
      paymentMethod: '',
      type: ''
    };
    const updatedPayments = [...formData.payments, newPayment];
    setFormData({ ...formData, payments: updatedPayments });
  };

  const removePayment = (index) => {
    const updatedPayments = [...formData.payments];
    updatedPayments.splice(index, 1);
    setFormData({ ...formData, payments: updatedPayments });
  };

  let key;
  const handlePrintClick = async (e) => {
    if (formData.orderNumber === '') {
      window.alert('Invoice number is not valid');
      return;
    }

    e.preventDefault();
    if (!key) {
      try {
        const response = await fetch(`${BASE_URL}/api/invoicequote/createInvoiceQuote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        console.log('Invoice submitted successfully:', data);

        setResponseMessage(`Invoice submitted successfully.`);
        key = data.uniqueKey;
        setUniqueKey(data.uniqueKey);
        console.log(uniqueKey);

        setTimeout(() => {
          setResponseMessage('');
        }, 1000);
      } catch (error) {
        console.error('Error submitting invoice:', error);
        setResponseMessage(`Error, check duplicate number`);

        setTimeout(() => {
          setResponseMessage('');
        }, 1000);
      }
    }

    if (key) {
      window.open(`/print/${key}`, '_blank');
      window.location.reload();
    } else {
      console.log('Unique key is undefined. Cannot proceed to print page.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/invoicequote/createInvoiceQuote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Invoice submitted successfully:', data);
      setResponseMessage(`Invoice submitted successfully.`);
      setUniqueKey(data.uniqueKey);
      console.log(uniqueKey);
      setTimeout(() => {
        setResponseMessage('');
      }, 1000);
      window.location.reload();
    } catch (error) {
      console.error('Error submitting invoice:', error);
      setResponseMessage(`Error, It could be becuase of duplicate Invoice number`);

      setTimeout(() => {
        setResponseMessage('');
      }, 1000);
    }
  };

  return (
    <div ref={componentRef} className="print-border-none print-no-shadow print-no-py .print-no-my mx-auto max-w-7xl rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
      <form className="print-border-none relative flex flex-col px-2 md:flex-row" onSubmit={handleSubmit}>
        <div className="print-shadow-none print-border-none print-no-py .print-no-my flex-1 space-y-6 rounded-xl bg-white py-4 md:p-6">
            {/* row 1 compnay info and invoice infor */}
            <div className="print-border-none print-border-none flex w-full flex-col gap-6 border-b border-[#6D8196] pb-6 lg:flex-row lg:justify-between">
              <div>
                <Company />
              </div>
              <div className="space-y-4">
                <div>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-base font-semibold text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none">
                    <option value="invoice">Invoice</option>
                    <option value="quote">Quote</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">Order Date</label>
                    <input type="date" name="dateOrdered" value={formData.dateOrdered} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">Due Date</label>
                    <input type="date" name="dateDue" value={formData.dateDue} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">Shipping Method</label>
                    <input type="text" name="shippingMethod" value={formData.shippingMethod} placeholder="Shipping Method" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">{invoiceNoLbl}</label>
                    <input type="text" name="orderNumber" value={formData.orderNumber} placeholder={invoiceNoLbl} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" required />
                  </div>
                </div>
                {/* <div className="flex min-w-[100px] items-center ">
                  <label className="min-w-24 ">Payment:</label>{" "}
                  <input
                    type="text"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    placeholder="payment Method"
                    onChange={handleChange}
                    className="px-2 py-1 w-full"

                  />
                </div> */}
                {/*                                 
                                <div className="flex min-w-[100px] items-center ">
                                    <label className="min-w-24 ">Invoice_No: </label> 
                                    <input
                                        type="text"
                                        name="orderNumber"
                                        value={formData.trackingid}
                                        placeholder='Invoice no'
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"
                                          
                                    />
                                </div>*/}
              </div>
            </div>

            {/* show customer name list pop up button */}
            <button onClick={() => setIsPopupOpen(true)} type="button" className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-4 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200">
              Select Customer
              <RiArrowDropDownLine className="text-xl" />
            </button>
            
            {/* customers name dropdown list pop up */}
            {isPopupOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="mx-4 w-full max-w-lg rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#384959]">Select Customer</h2>
                    <button onClick={() => setIsPopupOpen(false)} type="button" className="rounded-lg border-2 border-[#6D8196] p-2 text-[#6D8196] hover:border-red-400 hover:text-red-400 transition-colors duration-200">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <ul className="max-h-96 space-y-3 overflow-y-auto">
                    {Array.isArray(customers) && customers.length > 0 ? (
                      customers.map((customer) => (
                        <li key={customer.uniqueKey} className="flex items-center justify-between rounded-lg border-2 border-[#6D8196] p-4 hover:border-[#6A89A7] hover:bg-[#BDDDFC] transition-all duration-200">
                          <div>
                            <p className="font-semibold text-[#384959]">{customer.primaryContactFirstName} {customer.primaryContactLastName}</p>
                            <p className="text-sm text-[#6D8196]">{customer.primaryContactEmail}</p>
                          </div>
                          <button onClick={() => populateCustomer(customer.uniqueKey)} type="button" className="rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] p-2 text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200">
                            <FaPlus />
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-center py-8 text-[#6D8196]">No customers found</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* row 2, billing adress and shipping adress  city statecounty email adress */}
            <div className="print-border-none grid grid-cols-1 gap-8 border-b border-[#6D8196] pb-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-[#384959]">Billing Address</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#384959]">First Name</label>
                      <input type="text" name="billingFirstName" value={formData.billingFirstName} placeholder="First Name" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#384959]">Last Name</label>
                      <input type="text" name="billingLastName" value={formData.billingLastName} placeholder="Last Name" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">Address</label>
                    <input type="text" name="billingAddress" value={formData.billingAddress} placeholder="Street Address" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#384959]">City</label>
                      <input type="text" name="billingCity" value={formData.billingCity} placeholder="City" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#384959]">State</label>
                      <input type="text" name="billingState" value={formData.billingState} placeholder="State" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">Email</label>
                    <input type="email" name="billingEmailAddress" value={formData.billingEmailAddress} placeholder="Email Address" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-[#384959]">Shipping Address</h3>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">Name</label>
                    <input type="text" name="shippingFirstName" value={formData.shippingFirstName} placeholder="Shipping Name" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">Address</label>
                    <input type="text" name="shippingAddress" value={formData.shippingAddress} placeholder="Street Address" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#384959]">City</label>
                      <input type="text" name="shippingCity" value={formData.shippingCity} placeholder="City" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[#384959]">State</label>
                      <input type="text" name="shippingState" value={formData.shippingState} placeholder="State" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#384959]">Postcode</label>
                    <input type="text" name="shippingPostcode" value={formData.shippingPostcode} placeholder="Postal Code" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* row 3 items  product, color, size/qty, unit price, tax, qty, total, tax exempt  */}
            <div className="print-no-py pt-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#384959]">Items</h3>
                <button type="button" onClick={addItem} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-4 py-2.5 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200">
                  <FaPlus />
                  Add Item
                </button>
              </div>
            </div>

            {/* items */}
            <div className="print-border-none overflow-x-auto">
              <div className="print-no-my min-w-[800px]">
                {/* item table header */}
                <div className="print-no-my print-text-12px mb-4 grid grid-cols-9 gap-3 rounded-lg bg-[#BDDDFC] p-4 text-sm font-semibold text-[#384959]">
                  <p className="col-span-2">Product</p>
                  <p>Color</p>
                  <p>Size/Qty</p>
                  <p>Unit Price</p>
                  <p>Tax</p>
                  <p>Qty</p>
                  <p>Total</p>
                  <p>Tax Exempt</p>
                </div>

                {/* items */}
                {formData.items.map((item, index) => (
                  <div key={index} className="mb-3 grid grid-cols-9 gap-3 rounded-lg border-2 border-[#6D8196] p-4 hover:border-[#6A89A7] transition-colors duration-200">

                    <div className="col-span-2">
                      <input type="text" name={`items[${index}].productName`} value={item.productName} onChange={(e) => handleItemChange(index, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Product Name" required />
                    </div>

                    {/* <div className="col-span-2 flex rounded-lg focus-within:border-black focus-within:border-2">

                      <input
                        type="text"
                        name={`items[${index}].productCode`}
                        value={item.productCode}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Code"
                        className="w-full text-center rounded px-2 focus:outline-none l"

                      />
                      <span className='pt-2'>-</span>
                      <input
                        type="text"
                        name={`items[${index}].productName`}
                        value={item.productName}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Name"
                        required
                        className="w-full text-center rounded px-2 focus:outline-none"

                      />

                    </div> */}



                    {/* <div className="col-span-2">
                      <input
                        type="text"
                        name={`items[${index}].productInfo`}
                        value={codeName} // User inputs both parts including the minus sign manually
                        onChange={(e) => {
                          const value = e.target.value;
                          setCodeName(value)

                          const [productCode, productName] = value.split(' - ');

                          setFormData(prevState => {
                            const updatedItems = [...prevState.items];
                            updatedItems[index] = {
                              ...updatedItems[index],
                              productCode: productCode || '', // Handle cases where productCode might be undefined
                              productName: productName || ''  // Handle cases where productName might be undefined
                            };
                            return { ...prevState, items: updatedItems };
                          });
                        }}
                        className="w-full rounded px-2 py-1"
                        placeholder="Product Code - Product Name" // This placeholder suggests the format to the user
                        required
                      />
                    </div> */}




                    {/* Color */}
                    <div>
                      <input type="text" name={`items[${index}].color`} value={item.color} onChange={(e) => handleItemChange(index, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Color" />
                    </div>
                    {/* Size */}
                    <div>
                      <input
                        type="text"
                        name={`items[${index}].size`}
                        value={item.size}
                        onClick={() => {
                          setVisiblePopupIndex(index);
                          setSizeQtyToggle(true);
                        }}
                        className="w-full cursor-pointer rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
                        placeholder="Size/Qty"
                      />
                    </div>

                    {/* Unit Price */}
                    <div>
                      <input type="number" name={`items[${index}].unitPrice`} value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    </div>
                    {/* Tax */}
                    <div>
                      <input
                        type="number"
                        name={`items[${index}].tax`}
                        value={item.tax}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <input type="number" name={`items[${index}].lineQty`} value={item.lineQty} onChange={(e) => handleItemChange(index, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                    </div>

                    {/* Total (Auto Calculated) */}
                    <div>
                      <input type="number" name={`items[${index}].lineTotal`} value={item.lineTotal.toFixed(1)} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" />
                    </div>
                    {/* Tax Exempt */}
                    <div className="flex items-center justify-center">
                      <input type="checkbox" name={`items[${index}].taxExempt`} checked={item.taxExempt} onChange={(e) => handleItemChange(index, e)} className="h-5 w-5 rounded border-2 border-[#6D8196] text-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20" />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const checkbox = document.querySelector(`input[name="items[${index}].taxExempt"]`);
                          if (checkbox) {
                            checkbox.click();
                            setTimeout(() => checkbox.click(), 0);
                          }
                        }}
                        className="no-print rounded-lg border-2 border-[#6A89A7] p-2 text-[#6A89A7] hover:bg-[#6A89A7] hover:text-white transition-colors duration-200"
                      >
                        <TiTick />
                      </button>

                      <button type="button" onClick={() => removeItem(index)} className="no-print rounded-lg border-2 border-red-400 p-2 text-red-400 hover:bg-red-400 hover:text-white transition-colors duration-200">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size/Qty Popup Modal - Rendered outside items loop */}
            {sizeQtyToggle && visiblePopupIndex !== null && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="mx-4 w-full max-w-4xl rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 shadow-2xl">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#384959]">Size & Quantity Details</h2>
                    <button
                      type="button"
                      className="rounded-lg border-2 border-[#6D8196] p-2 text-[#6D8196] hover:border-red-400 hover:text-red-400 transition-colors duration-200"
                      onClick={() => {
                        setSizeQtyToggle(false);
                      }}
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="mb-4 grid grid-cols-4 gap-4 rounded-lg bg-[#BDDDFC] p-4 text-sm font-semibold text-[#384959]">
                        <div>Size</div>
                        <div>Qty</div>
                        <div>Price</div>
                        <div>Total</div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 p-4">
                        {visiblePopupIndex !== null && formData.items[visiblePopupIndex] && (
                          <>
                            {/* Size S */}
                            <div className="flex items-center font-medium text-[#384959]">Size S</div>
                            <input type="number" name="sQty" value={formData.items[visiblePopupIndex].sQty} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Qty" />
                            <input type="number" name="sPrice" value={formData.items[visiblePopupIndex].sPrice} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Price" />
                            <input type="number" name="sTotal" value={formData.items[visiblePopupIndex].sQty * formData.items[visiblePopupIndex].sPrice} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" placeholder="Total" />

                            {/* Size M */}
                            <div className="flex items-center font-medium text-[#384959]">Size M</div>
                            <input type="number" name="mQty" value={formData.items[visiblePopupIndex].mQty} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Qty" />
                            <input type="number" name="mPrice" value={formData.items[visiblePopupIndex].mPrice} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Price" />
                            <input type="number" name="mTotal" value={formData.items[visiblePopupIndex].mQty * formData.items[visiblePopupIndex].mPrice} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" placeholder="Total" />

                            {/* Size L */}
                            <div className="flex items-center font-medium text-[#384959]">Size L</div>
                            <input type="number" name="lQty" value={formData.items[visiblePopupIndex].lQty} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Qty" />
                            <input type="number" name="lPrice" value={formData.items[visiblePopupIndex].lPrice} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Price" />
                            <input type="number" name="lTotal" value={formData.items[visiblePopupIndex].lQty * formData.items[visiblePopupIndex].lPrice} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" placeholder="Total" />

                            {/* Size XL */}
                            <div className="flex items-center font-medium text-[#384959]">Size XL</div>
                            <input type="number" name="xlQty" value={formData.items[visiblePopupIndex].xlQty} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Qty" />
                            <input type="number" name="xlPrice" value={formData.items[visiblePopupIndex].xlPrice} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Price" />
                            <input type="number" name="xlTotal" value={formData.items[visiblePopupIndex].xlQty * formData.items[visiblePopupIndex].xlPrice} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" placeholder="Total" />

                            {/* Size 2XL */}
                            <div className="flex items-center font-medium text-[#384959]">Size 2XL</div>
                            <input type="number" name="2xlQty" value={formData.items[visiblePopupIndex]['2xlQty']} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Qty" />
                            <input type="number" name="2xlPrice" value={formData.items[visiblePopupIndex]['2xlPrice']} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Price" />
                            <input type="number" name="2xlTotal" value={formData.items[visiblePopupIndex]['2xlQty'] * formData.items[visiblePopupIndex]['2xlPrice']} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" placeholder="Total" />

                            {/* Size 3XL */}
                            <div className="flex items-center font-medium text-[#384959]">Size 3XL</div>
                            <input type="number" name="3xlQty" value={formData.items[visiblePopupIndex]['3xlQty']} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Qty" />
                            <input type="number" name="3xlPrice" value={formData.items[visiblePopupIndex]['3xlPrice']} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Price" />
                            <input type="number" name="3xlTotal" value={formData.items[visiblePopupIndex]['3xlQty'] * formData.items[visiblePopupIndex]['3xlPrice']} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" placeholder="Total" />

                            {/* Size 4XL */}
                            <div className="flex items-center font-medium text-[#384959]">Size 4XL</div>
                            <input type="number" name="4xlQty" value={formData.items[visiblePopupIndex]['4xlQty']} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Qty" />
                            <input type="number" name="4xlPrice" value={formData.items[visiblePopupIndex]['4xlPrice']} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Price" />
                            <input type="number" name="4xlTotal" value={formData.items[visiblePopupIndex]['4xlQty'] * formData.items[visiblePopupIndex]['4xlPrice']} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" placeholder="Total" />

                            {/* Size 5XL */}
                            <div className="flex items-center font-medium text-[#384959]">Size 5XL</div>
                            <input type="number" name="5xlQty" value={formData.items[visiblePopupIndex]['5xlQty']} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Qty" />
                            <input type="number" name="5xlPrice" value={formData.items[visiblePopupIndex]['5xlPrice']} onChange={(e) => handleItemChange(visiblePopupIndex, e)} className="w-full rounded-lg border-2 border-[#6D8196] px-3 py-2 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" placeholder="Price" />
                            <input type="number" name="5xlTotal" value={formData.items[visiblePopupIndex]['5xlQty'] * formData.items[visiblePopupIndex]['5xlPrice']} readOnly className="w-full rounded-lg border-2 border-[#6D8196] bg-[#BDDDFC] px-3 py-2 text-[#384959] outline-none" placeholder="Total" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* row 4 note,  sub total,  tax, grand total  */}
            <div className="print-border-none grid grid-cols-1 gap-8 border-b border-[#6D8196] pb-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#384959] mb-2">Notes</label>
                  <textarea name="note" value={formData.note} onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-3 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none resize-none" rows="3" placeholder="Add any notes here..."></textarea>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Terms</label>
                    <input type="text" name="paymentTerms" value={formData.paymentTerms} placeholder="Payment terms" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#384959] mb-2">Payment Date</label>
                    <input type="text" name="paymentDates" value={formData.paymentDates} placeholder="Payment date" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#384959] mb-2">Payment Method</label>
                  <input type="text" name="paymentMethod" value={formData.paymentMethod} placeholder="Payment method" onChange={handleChange} className="w-full rounded-lg border-2 border-[#6D8196] px-4 py-2.5 text-[#384959] placeholder-[#88BDF2] focus:border-[#6A89A7] focus:ring-2 focus:ring-[#6A89A7]/20 transition-all duration-200 outline-none" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-[#BDDDFC] p-6">
                  <h4 className="mb-4 text-lg font-bold text-[#384959]">Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-[#6D8196]">Subtotal:</span>
                      <span className="text-sm font-semibold text-[#384959]">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-[#6D8196]">Total Tax:</span>
                      <span className="text-sm font-semibold text-[#384959]">${totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#6D8196] pt-3">
                      <span className="text-base font-bold text-[#384959]">Grand Total:</span>
                      <span className="text-base font-bold text-[#6A89A7]">${grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-[#6D8196]">Payment Paid:</span>
                      <span className="text-sm font-semibold text-[#88BDF2]">${typeof formData.paymentPaid === 'number' ? formData.paymentPaid.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-[#6D8196]">Balance Due:</span>
                      <span className="text-sm font-semibold text-[#384959]">${typeof formData.paymentDue === 'number' ? formData.paymentDue.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-[#6D8196]">(All Prices are shown in USD)</p>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between border-b border-[#6D8196] pb-6">
              <p className="w-1/2 text-sm text-[#6D8196]">You are important to us. Your complete satisfaction is our intent. If you are happy with our service, tell all your friends. If you are disappointed, please tell us and we will do all in our power to make you happy.</p>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[#6A89A7] font-semibold hover:text-[#384959] hover:underline transition-colors duration-200"
                  onClick={() => {
                    setEditPayments(true);
                  }}
                >
                  Add/Edit Payments
                </button>
              </div>
            </div>
            {/* add payments plan/installments popup */}

            {editPayments && (
              <div className="fixed bottom-6 left-0 right-0 top-3 z-50 m-52 overflow-auto rounded-lg border-2 border-solid border-b-slate-300 border-l-[#6A89A7] border-r-[#6A89A7] bg-[#F8FAFC] p-10 shadow-2xl" style={{ boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.50)` }}>
                <button
                  type="button"
                  className="fixed right-60 top-10 rounded-md bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-3 py-1 text-lg font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7]"
                  onClick={() => {
                    setEditPayments(false);
                  }}
                >
                  Done
                </button>
                {/* <button type="button"
                    className="fixed top-10 right-60 bg-red-500 hover:bg-red-600  rounded-md px-3 py-1 font-semibold text-lg text-white"
                    onClick={() => { setEditPayments(false) }}>
                    X
                  </button> */}
                <div className="print-no-my print-text-12px mb-4 grid grid-cols-9 gap-4"></div>

                {formData.payments.map((payment, index) => (
                  <div key={index} className="mb-6 flex justify-between border-b-4 py-2">
                    <div className="flex gap-5">
                      <div className="flex flex-col gap-2 pt-2">
                        <label className="my-1">Date Paid</label>
                        {/* <label className="my-1">Out Standing Order Balance</label> */}
                        <label className="my-1">Order Payment Amount</label>
                      </div>

                      <div>
                        <div className="">
                          <input type="date" name={`payments[${index}].datePaid`} value={payment.datePaid} onChange={(e) => handlePaymentChange(index, e)} className="my-1 w-full rounded border-2 border-[#6D8196] px-2 py-1 text-[#384959]" placeholder="Date Paid" />
                        </div>

                        {/* <div className='flex items-center justify-center'>
                            <input
                              type="number"
                              name={`payments[${index}].outstandingOrderBalance`}
                              value={payment.date}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 my-1 w-full border-2"
                              placeholder='Outstanding Order Balance'
                            />
                          </div> */}

                        <div className="flex items-center justify-center">
                          <input type="number" name={`payments[${index}].orderPaymentAmount`} value={payment.orderPaymentAmount} onChange={(e) => handlePaymentChange(index, e)} className="my-1 w-full rounded border-2 border-[#6D8196] px-2 py-1 text-[#384959]" placeholder="orderPaymentAmount" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <div className="flex flex-col gap-2 pt-2">
                        {/* <label className="my-1">Total Payment Amount</label>
                          <label className="my-1">Refunded Amoung</label> */}
                        <label className="my-1">Payment Method</label>
                        {/* <label className="my-1">Payment Status</label> */}
                      </div>

                      <div>
                        {/* <div className='flex items-center justify-center'>
                            <input
                              type="Number"
                              name={`payments[${index}].totalPaymentAmount`}
                              value={payment.totalPaymentAmount}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 my-1 w-full border-2"
                              placeholder='Total Payment Amount'
                            />
                          </div>

                          <div className='flex items-center justify-center'>
                            <input
                              type="number"
                              name={`payments[${index}].refundedAmount`}
                              value={payment.refundedAmount}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 my-1 w-full border-2"
                              placeholder='Refunded Amount'
                            />
                          </div> */}

                        <div className="flex items-center justify-center">
                          <input type="text" name={`payments[${index}].paymentMethod`} value={payment.paymentMethod} onChange={(e) => handlePaymentChange(index, e)} className="my-1 w-full rounded border-2 border-[#6D8196] px-2 py-1 text-[#384959]" placeholder="Payment Method" />
                        </div>

                        {/* <div className='flex items-center justify-center'>
                            <input
                              type="text"
                              name={`payments[${index}].paymentStatus`}
                              value={payment.paymentStatus}
                              onChange={(e) => handlePaymentChange(index, e)}
                              className="rounded px-2 py-1 my-1 w-full border-2"
                              placeholder='Payment Status'
                            />
                          </div> */}

                        <div className="flex justify-center">
                          <button type="button" onClick={() => removePayment(index)} className="no-print m-1 rounded bg-red-400 px-4 py-1 text-white hover:bg-red-500">
                            X
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-center gap-5">
                  <label>{`Payment Terms:`}</label>
                  <input type="text" name="paymentTerms" value={formData.paymentTerms} placeholder="Payment Terms" onChange={handleChange} className="my-1 w-1/2 rounded border-2 border-[#6D8196] px-2 py-1 text-[#384959]" />
                </div>

                <button type="button" onClick={addPayment} className="no-print my-3 rounded bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-4 py-1 text-white hover:from-[#88BDF2] hover:to-[#6A89A7]">
                  Add Payment
                </button>
              </div>
            )}

            <div className="no-print print-no-py print-no-my flex items-center justify-center gap-4 px-5 pt-10">
              <button type="submit" className="rounded-lg bg-gradient-to-r from-[#6A89A7] to-[#88BDF2] px-8 py-3 font-semibold text-white hover:from-[#88BDF2] hover:to-[#6A89A7] transition-colors duration-200">
                Save
              </button>

              <button type="button" onClick={handlePrintClick} className="rounded-lg border-2 border-[#6A89A7] px-8 py-3 font-semibold text-[#6A89A7] hover:bg-[#6A89A7] hover:text-white transition-colors duration-200">
                Print
              </button>

              {responseMessage && <span className={`text-sm font-medium ${responseMessage.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{responseMessage}</span>}
            </div>
          </div>
        </form>
      </div>
  );
};

export default Invoice;
