import React from 'react';
import Company from './Company';

import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

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
    <div className="ml-28 mt-16">
      <div ref={componentRef} className="print-border-none print-no-shadow print-no-py .print-no-my mx-auto min-w-[1010px] rounded-lg border-2 border-solid border-[#f1f1f1] border-l-[#d1e4f5] border-r-[#d1e4f5] bg-white p-8 py-6 shadow-xl">
        <form className="print-border-none relative flex flex-col px-2 md:flex-row" onSubmit={handleSubmit}>
          <div className="print-shadow-none print-border-none print-no-py .print-no-my my-6 flex-1 space-y-2 rounded-md bg-white py-4 shadow-sm sm:space-y-4 md:p-6">
            {/* row 1 compnay info and invoice infor */}
            <div className="print-border-none print-border-none flex w-full justify-between border-b">
              <div>
                <Company />
              </div>
              <div className="mb-1 mt-3">
                <div className="">
                  <select name="type" value={formData.type} onChange={handleChange} className="borde w-[97%] rounded py-1 text-xl font-semibold">
                    {/* <option value="">Select</option> */}
                    <option value="invoice">Invoice</option>
                    <option value="quote">Quote</option>
                  </select>
                </div>

                <div className="flex min-w-[100px] items-center">
                  <label className="min-w-24">Order Date: </label>
                  <input type="date" name="dateOrdered" placeholder="Order Date" value={formData.dateOrdered} onChange={handleChange} className="my-1 w-full px-2 py-1" />
                </div>
                <div className="flex min-w-[100px] items-center">
                  <label className="min-w-24">Due Date: </label>
                  <input type="date" name="dateDue" placeholder="Due Date" value={formData.dateDue} onChange={handleChange} className="my-1 w-full px-2 py-1" />
                </div>
                <div className="flex min-w-[100px] items-center">
                  <label className="min-w-24">Shipping: </label>
                  <input type="text" name="shippingMethod" value={formData.shippingMethod} placeholder="Shipping Method" onChange={handleChange} className="my-1 w-full px-2 py-1" />
                </div>
                <div className="flex min-w-[100px] items-center">
                  <label className="min-w-24">{invoiceNoLbl}: </label> {/*Order Number*/}
                  <input type="text" name="orderNumber" value={formData.orderNumber} placeholder={invoiceNoLbl} onChange={handleChange} className="w-full px-2 py-1" required />
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
            <button onClick={() => setIsPopupOpen(true)} type="button" className="ml-8 flex items-center font-bold text-blue-500 hover:underline">
              Customers
              <RiArrowDropDownLine style={{ fontSize: '24px', marginTop: '4px' }} />
            </button>
            {/* customers name dropdown list pop up */}
            <div className="ml-60 mt-24">
              {isPopupOpen && (
                <div className="fixed bottom-5 top-16 z-30 my-4 flex w-1/3 justify-center overflow-auto rounded-xl border-2 border-blue-300 bg-white shadow-2xl shadow-black" style={{ boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.25)` }}>
                  <div className="w-full rounded-lg bg-white px-6 py-12 pb-20 text-center">
                    <button className="absolute right-3 top-3 mb-4 rounded border-2 border-red-600 px-3 py-1 font-semibold text-red-600 hover:bg-red-50" onClick={() => setIsPopupOpen(false)} type="button">
                      X
                    </button>
                    <h2 className="mb-4 text-2xl">Customers</h2>
                    <ul className="text-left">
                      {Array.isArray(customers) && customers.length > 0 ? (
                        customers.map((customer) => (
                          <li key={customer.uniqueKey} className="mb-2 flex items-center justify-between gap-5 border-b-2 border-blue-200 pb-3">
                            {customer.primaryContactFirstName} {customer.primaryContactLastName}
                            <button onClick={() => populateCustomer(customer.uniqueKey)} type="button" className="rounded border-2 border-blue-400 px-3 py-1 text-lg font-semibold text-blue-500 hover:bg-green-50">
                              <FaPlus />
                            </button>
                          </li>
                        ))
                      ) : (
                        <li>No customers found</li>
                      )}
                      <div className="min-h-12"></div>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* row 2, billing adress and shipping adress  city statecounty email adress */}
            <div className="print-border-none flex justify-between border-b px-5">
              <div>
                <p className="print-text-12px p-2 pt-0 text-lg font-semibold">Billing Address</p>

                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="billingFirstName" value={formData.billingFirstName} placeholder="Billing" onChange={handleChange} className="w-1/3 px-2 py-1" />
                  <input type="text" name="billingLastName" value={formData.billingLastName} placeholder="Name" onChange={handleChange} className="w-full px-2 py-1" />
                </div>

                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="billingAddress" value={formData.billingAddress} placeholder="Address" onChange={handleChange} className="w-full px-2 py-1" />
                </div>
                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="billingCity" value={formData.billingCity} placeholder="City" onChange={handleChange} className="my-1 w-full px-2 py-1" />
                </div>
                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="billingState" value={formData.billingState} placeholder="State" onChange={handleChange} className="my-1 w-full px-2 py-1" />
                </div>
                {/* <div className="flex min-w-[100px] items-center "> country
                                <input
                                    type="text"
                                    name="shippingMethod"
                                    value={formData.billing}
                                    placeholder='Shipping Method'
                                    onChange={handleChange}
                                    className="px-2 py-1 w-full"
                                      
                                />
                            </div> */}
                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="billingEmailAddress" value={formData.billingEmailAddress} placeholder="Email " onChange={handleChange} className="w-full px-2 py-1" />
                </div>
              </div>

              <div>
                <p className="print-text-12px p-2 text-lg font-semibold">Shipping Address</p>

                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="shippingFirstName" value={formData.shippingFirstName} placeholder="Shipping Name" onChange={handleChange} className="w-full px-2 py-1" />
                </div>

                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="shippingAddress" value={formData.shippingAddress} placeholder="Address" onChange={handleChange} className="w-full px-2 py-1" />
                </div>
                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="shippingCity" value={formData.shippingCity} placeholder="City" onChange={handleChange} className="my-1 w-full px-2 py-1" />
                </div>
                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="shippingState" value={formData.shippingState} placeholder="State" onChange={handleChange} className="my-1 w-full px-2 py-1" />
                </div>
                {/* <div className="flex min-w-[100px] items-center "> country
                                <input
                                    type="text"
                                    name="shippingMethod"
                                    value={formData.billing}
                                    placeholder='Shipping Method'
                                    onChange={handleChange}
                                    className="px-2 py-1 w-full"
                                      
                                />
                            </div> */}
                <div className="flex min-w-[100px] items-center">
                  <input type="text" name="shippingPostcode" value={formData.shippingPostcode} placeholder="Postcode " onChange={handleChange} className="w-full px-2 py-1" />
                </div>
              </div>
            </div>

            {/* row 3 items  product, color, size/qty, unit price, tax, qty, total, tax exempt  */}
            <div className="print-no-py pt-12">
              <h3 className="print-no-py text-Black font-Josefin-Sans m-[-10 mb-2 block rounded-md bg-gradient-to-r from-blue-200 to-blue-400 px-5 py-2 text-xl font-semibold uppercase">Items</h3>
            </div>

            {/* items */}
            <div className="print-border-none px- flex justify-between border-b text-sm">
              <div className="print-no-my mt-4">
                {/* item table header */}
                <div className="print-no-my print-text-12px mb-4 grid grid-cols-10 gap-4 text-sm font-semibold">
                  <p className="col-span-2">Product </p>
                  <p>Color</p>
                  <p className="pl-2">Size/Qty</p>
                  <p>Unit Price</p>
                  <p className="pl-4">Tax</p>
                  <p>Qty:</p>
                  <p>Total:</p>
                  <p>Tax Exempt</p>
                </div>

                {/* items */}
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-10 gap-4">

                    <div className="col-span-2">
                      {/* <label className="block mb-2">Product Name:</label> */}
                      <input type="text" name={`items[${index}].productName`} value={item.productName} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="Name" required />
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
                      {/* <label className="block mb-2">Color:</label>  */}
                      <input type="text" name={`items[${index}].color`} value={item.color} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="Color" />
                    </div>
                    {/* Size */}
                    <div>
                      {/* <label className="block mb-2">Size:</label> */}
                      <input
                        type="text"
                        name={`items[${index}].size`}
                        value={item.size}
                        onClick={() => {
                          setVisiblePopupIndex(index);
                          setSizeQtyToggle(true);
                        }}
                        className="w-full cursor-pointer rounded px-2 py-1"
                        placeholder="Size/Qty"
                      />
                    </div>

                    {/* Unit Price */}
                    <div>
                      {/* <label className="block mb-2">Unit Price:</label> */}
                      <input type="number" name={`items[${index}].unitPrice`} value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" />
                    </div>
                    {/* Tax */}
                    <div className="pl-4">
                      {/* <label className="block mb-2">Tax (%):</label> */}
                      <input
                        type="number"
                        name={`items[${index}].tax`}
                        value={item.tax}
                        onChange={(e) => handleItemChange(index, e)}
                        // readOnly
                        className="w-full rounded px-2 py-1"
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      {/* <label className="block mb-2">Quantity:</label> */}
                      <input type="number" name={`items[${index}].lineQty`} value={item.lineQty} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" />
                    </div>

                    {/* Total (Auto Calculated) */}
                    <div>
                      {/* <label className="block mb-2">Total:</label> */}
                      <input type="number" name={`items[${index}].lineTotal`} value={item.lineTotal.toFixed(1)} readOnly className="w-full rounded px-2 py-1" />
                    </div>
                    {/* Tax Exempt */}
                    <div className="pl-3">
                      {/* <label className="block mb-2">Tax Exempt:</label> */}
                      <input type="checkbox" name={`items[${index}].taxExempt`} checked={item.taxExempt} onChange={(e) => handleItemChange(index, e)} className="rounded px-2 py-1" />
                    </div>

                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          const checkbox = document.querySelector(`input[name="items[${index}].taxExempt"]`);
                          if (checkbox) {
                            checkbox.click(); // Check
                            setTimeout(() => checkbox.click(), 0); // Uncheck right after
                          }
                        }}
                        className="no-print hover:bg-red-6 m-1 rounded border-[1px] border-blue-400 px-3 py-[6px] text-base font-semibold text-blue-400 hover:font-extrabold"
                      >
                        <TiTick />
                      </button>

                      <button type="button" onClick={() => removeItem(index)} className="no-print hover:bg-red-6 m-1 rounded border-[1px] border-red-400 px-4 py-1 font-semibold text-red-400 hover:font-extrabold">
                        X
                      </button>
                    </div>

                    {/* {sizeQtyToggle && visiblePopupIndex === index && ( */}

                    <div
                      // className="fixed z-50 top-3 right-0 left-0 bottom-6 bg-white rounded-lg shadow-2xl p-10  border-b-slate-300 border-solid border-2 border-r-[#6539c0] border-l-[#6539c0] overflow-auto mx-40 my-10"
                      className={`fixed bottom-6 left-0 right-0 top-3 z-50 mx-40 my-10 overflow-auto rounded-lg border-2 border-solid border-b-slate-300 border-l-[#6539c0] border-r-[#6539c0] bg-white p-10 shadow-2xl transition-opacity duration-300 ease-in-out ${sizeQtyToggle && visiblePopupIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                      style={{
                        boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.50)`
                      }}
                    >
                      <button
                        type="button"
                        className="absolute right-7 top-5 rounded-md bg-red-500 px-5 py-1 text-lg font-semibold text-white hover:bg-red-600"
                        onClick={() => {
                          setSizeQtyToggle(false);
                        }}
                      >
                        X
                      </button>

                      <button
                        type="button"
                        className="absolute bottom-3 right-7 rounded-md bg-blue-500 px-5 py-1 text-lg font-semibold text-white hover:bg-blue-600"
                        onClick={() => {
                          setSizeQtyToggle(false);
                        }}
                      >
                        OK
                      </button>

                      <div className="min-w-full rounded-lg bg-white shadow">
                        <div className="grid grid-cols-4 gap-4 border-b border-gray-200 p-4">
                          {/* Table Header */}
                          <div className="font-bold">Size</div>
                          <div className="font-bold">Qty</div>
                          <div className="font-bold">Price</div>
                          <div className="font-bold">Total</div>
                        </div>
                        {/* Table Body */}
                        <div className="grid grid-cols-4 gap-4 p-4">
                          {/* Size S */}
                          <div>Size S</div>
                          <input type="number" name="sQty" value={item.sQty} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="sQty" />
                          <input type="number" name="sPrice" value={item.sPrice} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="sPrice" />
                          <input
                            type="number"
                            name="sTotal"
                            value={item.sQty * item.sPrice} // Automatically calculated
                            readOnly
                            className="w-full rounded bg-gray-200 px-2 py-1"
                            placeholder="sTotal"
                          />

                          {/* Size M */}
                          <div>Size M</div>
                          <input type="number" name="mQty" value={item.mQty} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="mQty" />
                          <input type="number" name="mPrice" value={item.mPrice} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="mPrice" />
                          <input
                            type="number"
                            name="mTotal"
                            value={item.mQty * item.mPrice} // Automatically calculated
                            readOnly
                            className="w-full rounded bg-gray-200 px-2 py-1"
                            placeholder="mTotal"
                          />

                          {/* Size L */}
                          <div>Size L</div>
                          <input type="number" name="lQty" value={item.lQty} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="lQty" />
                          <input type="number" name="lPrice" value={item.lPrice} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="lPrice" />
                          <input
                            type="number"
                            name="lTotal"
                            value={item.lQty * item.lPrice} // Automatically calculated
                            readOnly
                            className="w-full rounded bg-gray-200 px-2 py-1"
                            placeholder="lTotal"
                          />

                          {/* Size XL */}
                          <div>Size XL</div>
                          <input type="number" name="xlQty" value={item.xlQty} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="xlQty" />
                          <input type="number" name="xlPrice" value={item.xlPrice} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="xlPrice" />
                          <input
                            type="number"
                            name="xlTotal"
                            value={item.xlQty * item.xlPrice} // Automatically calculated
                            readOnly
                            className="w-full rounded bg-gray-200 px-2 py-1"
                            placeholder="xlTotal"
                          />

                          {/* Size 2XL */}
                          <div>Size 2XL</div>
                          <input type="number" name="2xlQty" value={item['2xlQty']} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="2xlQty" />
                          <input type="number" name="2xlPrice" value={item['2xlPrice']} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="2xlPrice" />
                          <input
                            type="number"
                            name="2xlTotal"
                            value={item['2xlQty'] * item['2xlPrice']} // Automatically calculated
                            readOnly
                            className="w-full rounded bg-gray-200 px-2 py-1"
                            placeholder="2xlTotal"
                          />

                          {/* Size 3XL */}
                          <div>Size 3XL</div>
                          <input type="number" name="3xlQty" value={item['3xlQty']} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="3xlQty" />
                          <input type="number" name="3xlPrice" value={item['3xlPrice']} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="3xlPrice" />
                          <input
                            type="number"
                            name="3xlTotal"
                            value={item['3xlQty'] * item['3xlPrice']} // Automatically calculated
                            readOnly
                            className="w-full rounded bg-gray-200 px-2 py-1"
                            placeholder="3xlTotal"
                          />

                          {/* Size 4XL */}
                          <div>Size 4XL</div>
                          <input type="number" name="4xlQty" value={item['4xlQty']} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="4xlQty" />
                          <input type="number" name="4xlPrice" value={item['4xlPrice']} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="4xlPrice" />
                          <input
                            type="number"
                            name="4xlTotal"
                            value={item['4xlQty'] * item['4xlPrice']} // Automatically calculated
                            readOnly
                            className="w-full rounded bg-gray-200 px-2 py-1"
                            placeholder="4xlTotal"
                          />

                          {/* Size 5XL */}
                          <div>Size 5XL</div>
                          <input type="number" name="5xlQty" value={item['5xlQty']} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="5xlQty" />
                          <input type="number" name="5xlPrice" value={item['5xlPrice']} onChange={(e) => handleItemChange(index, e)} className="w-full rounded px-2 py-1" placeholder="5xlPrice" />
                          <input
                            type="number"
                            name="5xlTotal"
                            value={item['5xlQty'] * item['5xlPrice']} // Automatically calculated
                            readOnly
                            className="w-full rounded bg-gray-200 px-2 py-1"
                            placeholder="5xlTotal"
                          />
                        </div>
                      </div>
                    </div>

                    {/* )} */}
                  </div>
                ))}
                <button type="button" onClick={addItem} className="no-print my-3 rounded border-[1px] border-blue-500 bg-transparent px-4 py-1 font-semibold text-blue-700 hover:bg-blue-200 hover:text-black">
                  Add Item
                </button>
              </div>
            </div>

            {/* row 4 note,  sub total,  tax, grand total  */}
            <div className="print-border-none flex justify-between border-b px-5">
              <div className="print-text-12px mt-4 flex w-[80%] flex-col">
                <label className="mt-3 px-2 font-semibold text-black">Notes</label>
                <textarea name="note" value={formData.note} onChange={handleChange} className="h-8 w-[100%] rounded border-2 px-2 py-1"></textarea>

                <label className="mt-3 px-2 font-semibold text-black">Terms</label>
                <input type="text" name="paymentTerms" value={formData.paymentTerms} placeholder="" onChange={handleChange} className="w-full border-2 px-2 py-1" />
                <div className=" ">
                  <label className="mt-3 px-2 font-semibold text-black">Payment Date</label>
                  <input type="text" name="billingAddress" value={formData.paymentDates} placeholder="" onChange={handleChange} className="w-full px-2 py-1" />
                </div>
                <label className="mt-3 px-2 font-semibold text-black">Payment Method</label>

                <input type="text" name="payment Method" value={formData.paymentMethod} placeholder="" onChange={handleChange} className="mb-4 w-full px-2 py-1" />
              </div>

              <div className="w-full">
                <div className="flex w-full justify-end gap-5">
                  <div className="text mt-1 flex flex-col gap-6 font-semibold">
                    <label className="mb-2 block">Subtotal:</label>
                    <label className="mb-2 block">Total Tax:</label>
                    <label className="mb-2 block">Grand Total:</label>
                    <label className="mb-2 block">Payment Paid:</label>
                    <label className="mb-2 block">Balance Due:</label>
                    <label className="mb-2 block text-[12px]">{`(All Prices are shown in USD)`}</label>
                  </div>

                  <div className="text flex flex-col gap-6 font-semibold">
                    <div className=" ">
                      {/* <label className="block mb-2 ">Subtotal:</label> */}
                      <input type="number" value={subtotal.toFixed(1)} name="subtotal" onChange={handleChange} readOnly className="rounded px-2 py-1" />
                    </div>

                    <div className=" ">
                      {/* <label className="block mb-2 ">{`Total Tax:`}</label> */}
                      <div className="">
                        <input type="number" value={totalTax.toFixed(1)} name="totalTax" readOnly onChange={handleChange} className="rounded px-2 py-1" />
                      </div>
                    </div>
                    <div className=" ">
                      {/* <label className="block mb-2 ">Grand Total:</label> */}
                      <input type="number" name="grandTotal" value={grandTotal.toFixed(1)} onChange={handleChange} readOnly className="rounded px-2 py-1" />
                    </div>

                    <div className=" ">
                      {/* <label className="block mb-2 ">Payment Paid:</label> */}
                      <input type="number" name="paymentPaid" value={formData.paymentPaid} onChange={handleChange} className="rounded px-2 py-1" />
                    </div>
                    <div className=" ">
                      {/* <label className="block mb-2 ">Balance Due:</label> */}
                      <input
                        type="number"
                        name="paymentDue"
                        value={(grandTotal - formData.paymentPaid).toFixed(1)}
                        // onChange={paymentDueHandleChange}
                        readOnly
                        className="rounded px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <p className="w-1/2">You are important to us. Your complete satisfaction is our intent. If you are happy with our service, tell all your friends. If you are disappointed, please tell us and we will do all in our power to make you happy.</p>

              <div className="flex justify-end pr-32">
                <button
                  type="button"
                  className="text-blue-500 underline"
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
              <div className="fixed bottom-6 left-0 right-0 top-3 z-50 m-52 overflow-auto rounded-lg border-2 border-solid border-b-slate-300 border-l-[#6539c0] border-r-[#6539c0] bg-white p-10 shadow-2xl" style={{ boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.50)` }}>
                <button
                  type="button"
                  className="fixed right-60 top-10 rounded-md bg-blue-500 px-3 py-1 text-lg font-semibold text-white hover:bg-blue-600"
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
                          <input type="date" name={`payments[${index}].datePaid`} value={payment.datePaid} onChange={(e) => handlePaymentChange(index, e)} className="my-1 w-full rounded border-2 px-2 py-1" placeholder="Date Paid" />
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
                          <input type="number" name={`payments[${index}].orderPaymentAmount`} value={payment.orderPaymentAmount} onChange={(e) => handlePaymentChange(index, e)} className="my-1 w-full rounded border-2 px-2 py-1" placeholder="orderPaymentAmount" />
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
                          <input type="text" name={`payments[${index}].paymentMethod`} value={payment.paymentMethod} onChange={(e) => handlePaymentChange(index, e)} className="my-1 w-full rounded border-2 px-2 py-1" placeholder="Payment Method" />
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
                          <button type="button" onClick={() => removePayment(index)} className="no-print m-1 rounded bg-red-500 px-4 py-1 text-white hover:bg-red-600">
                            X
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-center gap-5">
                  <label>{`Payment Terms:`}</label>
                  <input type="text" name="paymentTerms" value={formData.paymentTerms} placeholder="Payment Terms" onChange={handleChange} className="my-1 w-1/2 rounded border-2 px-2 py-1" />
                </div>

                <button type="button" onClick={addPayment} className="no-print my-3 rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600">
                  Add Payment
                </button>
              </div>
            )}

            <div className="no-print print-no-py print-no-my px-5 pt-10">
              <button type="submit" className="mx-3 rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600">
                Save
              </button>

              {/* old print using react-to-print */}
              {/* <button
                onClick={handlePrint}
                type="button"
                className=" bg-[#6539c0] hover:bg-purple-500 text-white px-6 py-2  rounded"

              >
                Print
              </button> */}

              {/* new print using using pdf */}
              <button type="button" onClick={handlePrintClick} className="my-3 mr-2 rounded border-[2px] border-blue-500 bg-transparent px-[20px] py-[5px] font-bold text-blue-700 hover:bg-blue-100 hover:text-black">
                Print
              </button>

              {responseMessage && <span className={`mt-4 ${responseMessage.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{responseMessage}</span>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invoice;
