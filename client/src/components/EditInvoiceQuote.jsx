
// imported react router dom
// added print link 
// changed "save" to "update"
// removed handle print function
// // replaced handle submit function
// added fetch invoices use effect


import React from "react";
import Company from "./Company";

import { useState, useEffect, useRef } from "react";
import { useReactToPrint } from 'react-to-print';

import { RiArrowDropDownLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";

import { Link } from 'react-router-dom';





const EditInvoiceQuote = ({ id }) => {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    const BASE_URL = process.env.REACT_APP_BASE_URL;


    const [subtotal, setSubtotal] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [responseMessage, setResponseMessage] = useState("");
    const [invoiceNoLbl, setinvoiceNoLbl] = useState('Invoice No')
    const [editPayments, setEditPayments] = useState(false)
    const [totalPayments, setTotalPayments] = useState(1)
    const [customers, setCustomers] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [taxRate, setTaxRate] = useState();
    const [uniqueKey, setUniqueKey] = useState();

    const [formData, setFormData] = useState({
        type: "invoice",
        orderNumber: "",
        dateOrdered: "",
        dateDue: "",
        orderTotal: 0,
        billingFirstName: "",
        billingLastName: "",
        billingCity: "",
        billingAddress: "",
        billingState: "",
        billingEmailAddress: "",
        shippingFirstName: "",
        shippingLastName: "",
        shippingAddress: "",
        shippingCity: "",
        shippingMethod: "",
        paymentMethod: "",
        shippingAddress: "",
        shippingState: "",
        shippingPostcod: "",
        paymentPaid: "",
        paymentDue: "",
        paymentTerms: "",
        paymentDates: "",

        items: [
            {
                orderNumber: "",
                productName: "",
                productCode: "",
                size: "",
                color: "",
                lineQty: 1,
                decorationProcess: "",
                unitPrice: 0,
                lineTotal: 0,
                tax: 0,
                taxExempt: false,
                orderShippingTotal: 0,
                poNumber: "",
                supplierPoNumber: "",
                productionStaffAccount: "",
                storeName: "",
                company: "",
                billingFirstName: "",
                billingLastName: "",
                billingEmailAddress: "",
                billingAddress: "",
                billingCity: "",
                billingState: "",
                billingPostcode: "",
                billingPhoneNo: "",
                shippingFirstName: "",
                shippingLastName: "",
                shippingAddress: "",
                shippingCity: "",
                shippingState: "",
                shippingPostcode: "",
                shippingPhoneNo: "",
                shippingMethod: "",
                designName: "",
                designPrice: 0,
            },
        ],
        payments:
            [
                {
                    datePaid: "",
                    outstandingOrderBalance: 0,
                    orderPaymentAmount: 0,
                    totalPaymentAmount: 0,
                    refundedAmount: 0,
                    paymentMethod: "",
                    paymentStatus: "", //paid or not

                },
            ],
        note: "Note here",
    });


    // ##############################################





    useEffect(() => {
        const fetchInvoiceQuote = async () => {
            try {
                const BASE_URL = process.env.REACT_APP_BASE_URL;
                const response = await fetch(`${BASE_URL}/api/invoicequote/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                console.log(data)

                // Convert MongoDB dates to HTML input type date format
                const convertDateToInputFormat = (mongoDate) => {
                    const dateObj = new Date(mongoDate);
                    const year = dateObj.getFullYear();
                    let month = (1 + dateObj.getMonth()).toString().padStart(2, '0');
                    let day = dateObj.getDate().toString().padStart(2, '0');
                    return `${year}-${month}-${day}`;
                };

                // Update state with fetched data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    type: data.type || 'invoice',
                    orderNumber: data.orderNumber || '',
                    dateOrdered: data.dateOrdered ? convertDateToInputFormat(data.dateOrdered) : '',
                    dateDue: data.dateDue ? convertDateToInputFormat(data.dateDue) : '',
                    orderTotal: data.orderTotal || 0,
                    billingCity: data.billingCity || '',
                    billingAddress: data.billingAddress || '',
                    billingState: data.billingState || '',
                    billingEmailAddress: data.billingEmailAddress || '',
                    shippingAddress: data.shippingAddress || '',
                    shippingCity: data.shippingCity || '',
                    shippingState: data.shippingState || '',
                    shippingPostcode: data.shippingPostcode || '',
                    shippingMethod: data.shippingMethod || '',
                    paymentMethod: data.paymentMethod || '',
                    paymentPaid: data.paymentPaid || 0,
                    paymentDue: data.paymentDue || 0,
                    paymentTerms: data.paymentTerms || '',
                    paymentDates: data.paymentDates || '',

                    // payments:  data.payments ,   


                    payments: data.payments.map(payment => ({
                        ...payment,
                        datePaid: payment.datePaid ? convertDateToInputFormat(payment.datePaid) : '',
                    })),


                    // payments: data.payments ||
                    // [
                    //   {
                    //     datePaid: "",
                    //     outstandingOrderBalance: 0,
                    //     orderPaymentAmount: 0,
                    //     totalPaymentAmount: 0,
                    //     refundedAmount: 0,
                    //     paymentMethod: "",
                    //     paymentStatus: "", //paid or not

                    //   },
                    // ],

                    items: data.items || [{
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
                        designPrice: 0
                    }],
                    note: data.note || 'You are important to us. Your complete satisfaction is our intent. If you are happy with our service, tell all your friends. If you are disappointed, please tell us and we will do all in our power to make you happy.'
                }));


            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error state or display error message
            }
        };

        fetchInvoiceQuote();

    }, [id]); // Fetch data when id changes






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
        fetch(`${BASE_URL}/api/customer/names`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCustomers(data);
                } else {
                    console.error('Expected an array but got:', data);
                }
            })
            .catch(error => console.error('Error fetching customer names:', error));
    }, []);


    useEffect(() => {
        calculateTotals();
    }, [formData.items, grandTotal]);



    // ##############################################



    // function to fetch settings for taxrate
    const fetchSettings = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/settings`);
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
        fetch(`${BASE_URL}/api/customer/details/${uniqueKey}`)
            .then(response => response.json())
            .then(data => {
                // Extract relevant shipping and billing details from the customer data
                const {
                    primaryContactFirstName,
                    primaryContactLastName,
                    primaryContactEmail,
                    primaryContactPhone,
                    billingAddress1,
                    billingAddress2,
                    billingCity,
                    billingState,
                    billingCountry,
                    billingPostal,
                    shippingName,
                    shippingAddress1,
                    shippingAddress2,
                    shippingCity,
                    shippingState,
                    shippingCountry,
                    shippingPostal,
                    shippingPhone,
                    shippingDeliveryInstructions
                } = data;

                // Update the formData with the extracted details
                setFormData(prevFormData => ({
                    ...prevFormData,
                    billingFirstName: `${primaryContactFirstName}`,
                    billingLastName: `${primaryContactLastName}`,
                    billingCity,
                    billingAddress: `${billingAddress1}`,
                    billingState,
                    billingEmailAddress: primaryContactEmail,
                    shippingAddress: `${shippingAddress1}`,
                    shippingCity,
                    shippingState,
                    shippingPostcode: shippingPostal,
                    // Populate other fields if necessary
                }));

                // Close the popup after updating the form data
                setIsPopupOpen(false);
            })
            .catch(error => console.error('Error fetching customer details:', error));
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        console.log(formData)
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
        // Remove the 'items[index].' part from the name
        const key = name.replace(`items[${index}].`, "");

        // Handle checkbox separately
        if (type === "checkbox") {
            updatedItems[index] = { ...updatedItems[index], [key]: checked };
        } else {
            updatedItems[index] = { ...updatedItems[index], [key]: value };
        }

        // Auto-calculate lineTotal if unitPrice, lineQty, or tax changes
        if (["unitPrice", "lineQty", "taxExempt"].includes(key)) {
            const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
            const lineQty = parseInt(updatedItems[index].lineQty) || 0;

            // Calculate tax
            const tax = unitPrice * lineQty * (taxRate / 100);
            updatedItems[index].tax = tax;
            updatedItems[index].tax = tax;

            const taxExempt = updatedItems[index].taxExempt;
            let lineTotal = lineQty * unitPrice;
            lineTotal = taxExempt ? lineTotal : (lineTotal + tax);
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
            const taxAmount = taxExempt ? 0 : (tax);
            
             if (taxExempt){item.tax=0}

            subtotal += lineTotal;
            totalTax += taxAmount;
        });
        setSubtotal(subtotal);
        setTotalTax(totalTax);
        setGrandTotal(subtotal + totalTax);

        const computedOrderTotal = grandTotal;
        // console.log(`grandtotal ${grandTotal}`)
        // console.log(`computedordertotal ${computedOrderTotal}`)

        const updatedFormData = { ...formData, orderTotal: computedOrderTotal };
        setFormData(updatedFormData);
    };



    const addItem = () => {
        const newItems = [
            ...formData.items,
            {
                orderNumber: "",
                productName: "",
                productCode: "",
                size: "",
                color: "",
                lineQty: 1,
                decorationProcess: "",
                unitPrice: 0,
                lineTotal: 0,
                tax: 0,
                taxExempt: false,
                orderShippingTotal: 0,
                poNumber: "",
                supplierPoNumber: "",
                productionStaffAccount: "",
                storeName: "",
                company: "",
                billingFirstName: "",
                billingLastName: "",
                billingEmailAddress: "",
                billingAddress: "",
                billingCity: "",
                billingState: "",
                billingPostcode: "",
                billingPhoneNo: "",
                shippingFirstName: "",
                shippingLastName: "",
                shippingAddress: "",
                shippingCity: "",
                shippingState: "",
                shippingPostcode: "",
                shippingPhoneNo: "",
                shippingMethod: "",
                designName: "",
                designPrice: 0,
            },
        ];

        const updatedFormData = { ...formData, items: newItems };
        setFormData(updatedFormData);
    };

    useEffect(() => {
        let totalPaymentPaid = 0;
        let paymentDates = "";
        let paymentMethod = "";

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

        setFormData(prevFormData => ({
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
        const key = name.replace(`payments[${index}].`, "");

        updatedPayments[index] = {
            ...updatedPayments[index],
            [key]: value
        };


        const updatedFormData = { ...formData, payments: updatedPayments };
        setFormData(updatedFormData);
        console.log(updatedFormData)
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





    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${BASE_URL}/api/invoicequote/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Invoice updated successfully:', data);
            setResponseMessage('Invoice updated successfully.');

            setTimeout(() => {
                setResponseMessage('');
            }, 1000);

        } catch (error) {
            console.error('Error updating invoice:', error);
            setResponseMessage('Error');

            setTimeout(() => {
                setResponseMessage('');
            }, 1000);
        }
    };




    return (
        <div className="ml-28 mt-16">
            <div ref={componentRef} className="print-border-none print-no-shadow print-no-py .print-no-my py-6 mx-auto bg-white rounded-lg shadow-xl p-8 border-[#f1f1f1] border-r-[#d1e4f5] border-l-[#d1e4f5] border-solid border-2 min-w-[1010px]">
                <form
                    className="print-border-none relative flex flex-col px-2 md:flex-row"
                    onSubmit={handleSubmit}
                >
                    <div className="print-shadow-none print-border-none print-no-py .print-no-my my-6 flex-1 space-y-2  rounded-md bg-white py-4 shadow-sm sm:space-y-4 md:p-6">


                        {/* row 1 compnay info and invoice infor */}
                        <div className="print-border-none print-border-none flex justify-between w-full border-b">
                            <div>
                                <Company />
                            </div>
                            <div className="mt-3 mb-1">
                                <div className="">
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="text-xl font-semibold borde rounded py-1 w-[97%]"
                                    >
                                        {/* <option value="">Select</option> */}
                                        <option value="invoice">Invoice</option>
                                        <option value="quote">Quote</option>
                                    </select>
                                </div>

                                <div className="flex min-w-[100px] items-center ">
                                    <label className="min-w-24 ">Order Date: </label>
                                    <input
                                        type="date"
                                        name="dateOrdered"
                                        placeholder="Order Date"
                                        value={formData.dateOrdered}
                                        onChange={handleChange}
                                        className="px-2 py-1 my-1 w-full"

                                    />
                                </div>
                                <div className="flex min-w-[100px] items-center ">
                                    <label className="min-w-24 ">Due Date: </label>
                                    <input
                                        type="date"
                                        name="dateDue"
                                        placeholder="Due Date"
                                        value={formData.dateDue}
                                        onChange={handleChange}
                                        className="px-2 py-1 my-1 w-full"

                                    />
                                </div>
                                <div className="flex min-w-[100px] items-center ">
                                    <label className="min-w-24">Shipping: </label>
                                    <input
                                        type="text"
                                        name="shippingMethod"
                                        value={formData.shippingMethod}
                                        placeholder="Shipping Method"
                                        onChange={handleChange}
                                        className="px-2 py-1 my-1 w-full"

                                    />
                                </div>
                                <div className="flex min-w-[100px] items-center ">
                                    <label className="min-w-24 ">{invoiceNoLbl}: </label>{" "}
                                    {/*Order Number*/}
                                    <input
                                        type="text"
                                        name="orderNumber"
                                        value={formData.orderNumber}
                                        placeholder={invoiceNoLbl}
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"
                                        required

                                    />
                                </div>
                                <div className="flex min-w-[100px] items-center ">
                                    <label className="min-w-24 ">Payment:</label>{" "}
                                    {/*Order Number*/}
                                    <input
                                        type="text"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        placeholder="payment Method"
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />
                                </div>
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
                        <button
                            onClick={() => setIsPopupOpen(true)}
                            type="button"
                            className="text-blue-500 font-bold hover:underline flex items-center ml-8"
                        >
                            Customers
                            <RiArrowDropDownLine style={{ fontSize: '24px', marginTop: '4px' }} />

                        </button>
                        {/* customers name dropdown list pop up */}
                        <div className="ml-60 mt-24 ">

                            {isPopupOpen && (
                                <div className="fixed top-16 bottom-5 z-30  overflow-auto border-blue-300 border-2 my-4 shadow-black shadow-2xl w-1/3 bg-white flex justify-center rounded-xl"
                                    style={{ boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.25)`, }}
                                >
                                    <div className="  bg-white px-6 py-12 pb-20 rounded-lg w-full text-center">

                                        <button
                                            className="hover:bg-red-50 border-red-600 text-red-600 border-2 font-semibold px-3 py-1 rounded mb-4 absolute top-3 right-3"
                                            onClick={() => setIsPopupOpen(false)}
                                            type="button"
                                        >
                                            X
                                        </button>
                                        <h2 className="text-2xl mb-4">Customers</h2>
                                        <ul className="text-left">
                                            {Array.isArray(customers) && customers.length > 0 ? (
                                                customers.map(customer => (
                                                    <li key={customer.uniqueKey} className="flex justify-between gap-5 items-center mb-2 border-b-2 border-blue-200 pb-3">
                                                        {customer.primaryContactFirstName} {customer.primaryContactLastName}
                                                        <button
                                                            onClick={() => populateCustomer(customer.uniqueKey)}
                                                            type="button"
                                                            className="hover:bg-green-50 border-blue-400 text-blue-500 border-2 px-3  text-lg rounded font-semibold py-1 "
                                                        >
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
                        <div className="print-border-none flex justify-between px-5 border-b">
                            <div>
                                <p className="print-text-12px p-2 pt-0 text-lg font-semibold">Billing Address</p>
                                {/* <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="billingAddress"
                                        value={formData.billingFirstName}
                                        placeholder="first name"
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />

                                </div>
                                <div className="flex min-w-[100px] items-center ">

                                    <input
                                        type="text"
                                        name="billingAddress"
                                        value={formData.billingLastName}
                                        placeholder="lastname"
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />

                                </div> */}
                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="billingAddress"
                                        value={formData.billingAddress}
                                        placeholder="Address"
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />
                                </div>
                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="billingCity"
                                        value={formData.billingCity}
                                        placeholder="City"
                                        onChange={handleChange}
                                        className="px-2 py-1 my-1 w-full"

                                    />
                                </div>
                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="billingState"
                                        value={formData.billingState}
                                        placeholder="State"
                                        onChange={handleChange}
                                        className="px-2 py-1 my-1 w-full"

                                    />
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
                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="billingEmailAddress"
                                        value={formData.billingEmailAddress}
                                        placeholder="Email "
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />
                                </div>
                            </div>

                            <div>
                                {/* <p className="print-text-12px p-2 text-lg font-semibold">Shipping Address</p>
                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="shippingFirstName"
                                        value={formData.shippingFirstName}
                                        placeholder="First Name"
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />

                                </div>
                                <div className="flex min-w-[100px] items-center ">


                                    <input
                                        type="text"
                                        name="shippingName"
                                        value={formData.shippingName}
                                        placeholder="Last Name"
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />
                                </div> */}


                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="shippingAddress"
                                        value={formData.shippingAddress}
                                        placeholder="Address"
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />
                                </div>
                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="shippingCity"
                                        value={formData.shippingCity}
                                        placeholder="City"
                                        onChange={handleChange}
                                        className="px-2 py-1 my-1 w-full"

                                    />
                                </div>
                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="shippingState"
                                        value={formData.shippingState}
                                        placeholder="State"
                                        onChange={handleChange}
                                        className="px-2 py-1 my-1 w-full"

                                    />
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
                                <div className="flex min-w-[100px] items-center ">
                                    <input
                                        type="text"
                                        name="shippingPostcode"
                                        value={formData.shippingPostcode}
                                        placeholder="Postcode "
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />
                                </div>
                            </div>
                        </div>

                        {/* row 3 items  product, color, size/qty, unit price, tax, qty, total, tax exempt  */}
                        <div className="pt-12 print-no-py">
                            <h3 className="print-no-py text-xl font-semibold mb-2 bg-gradient-to-r from-blue-200 to-blue-400  block text-Black font-Josefin-Sans uppercase px-5 py-2 rounded-md m-[-10">
                                Items
                            </h3>
                        </div>

                        {/* items */}
                        <div className="print-border-none flex justify-between px- border-b text-sm">
                            <div className="mt-4 print-no-my">

                                {/* item table header */}
                                <div className="print-no-my print-text-12px grid grid-cols-10 gap-4 mb-4 text-sm font-semibold ">
                                    <p className="col-span-2" >Product </p>
                                    <p>Color</p>
                                    <p className="pl-2">Size/Qty</p>
                                    <p>Unit Price $</p>
                                    <p className="pl-4">{"Tax $"}</p>
                                    <p>Qty:</p>
                                    <p>Total:</p>
                                    <p>Tax Exempt</p>

                                </div>

                                {/* items */}
                                {formData.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-10 gap-4">
                                        {/* Product Name */}
                                        <div className="col-span-2">
                                            {/* <label className="block mb-2">Product Name:</label> */}
                                            <input
                                                type="text"
                                                name={`items[${index}].productName`}
                                                value={item.productName}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="rounded px-2 py-1 w-full"
                                                placeholder="Name"
                                                required

                                            />
                                        </div>
                                        {/* Color */}
                                        <div>
                                            {/* <label className="block mb-2">Color:</label>  */}
                                            <input
                                                type="text"
                                                name={`items[${index}].color`}
                                                value={item.color}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="rounded px-2 py-1 w-full"
                                                placeholder="Color"

                                            />
                                        </div>
                                        {/* Size */}
                                        <div>
                                            {/* <label className="block mb-2">Size:</label> */}
                                            <input
                                                type="text"
                                                name={`items[${index}].size`}
                                                value={item.size}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="rounded px-2 py-1 w-full"
                                                placeholder="Size/Qty"

                                            />
                                        </div>

                                        {/* Unit Price */}
                                        <div>
                                            {/* <label className="block mb-2">Unit Price:</label> */}
                                            <input
                                                type="number"
                                                name={`items[${index}].unitPrice`}
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="rounded px-2 py-1 w-full"

                                            />
                                        </div>
                                        {/* Tax */}
                                        <div className="pl-4">
                                            {/* <label className="block mb-2">Tax (%):</label> */}
                                            <input
                                                type="number"
                                                name={`items[${index}].tax`}
                                                value={item.tax}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="rounded px-2 py-1 w-full"
                                            />
                                        </div>

                                        {/* Quantity */}
                                        <div >
                                            {/* <label className="block mb-2">Quantity:</label> */}
                                            <input
                                                type="number"
                                                name={`items[${index}].lineQty`}
                                                value={item.lineQty}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="rounded px-2 py-1 w-full"

                                            />
                                        </div>

                                        {/* Total (Auto Calculated) */}
                                        <div>
                                            {/* <label className="block mb-2">Total:</label> */}
                                            <input
                                                type="number"
                                                name={`items[${index}].lineTotal`}
                                                value={item.lineTotal}
                                                readOnly
                                                className="rounded px-2 py-1 w-full"
                                            />
                                        </div>
                                        {/* Tax Exempt */}
                                        <div className="pl-3">
                                            {/* <label className="block mb-2">Tax Exempt:</label> */}
                                            <input
                                                type="checkbox"
                                                name={`items[${index}].taxExempt`}
                                                checked={item.taxExempt}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="rounded px-2 py-1"
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="no-print text-red-400 hover:bg-red-6 border-[1px] hover:font-extrabold border-red-400 m-1 font-semibold px-4 py-1 rounded"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="no-print my-3 bg-transparent border-[1px] border-blue-500  hover:bg-blue-200 hover:text-black  text-blue-700 font-semibold px-4 py-1 rounded"
                                >
                                    Add Item
                                </button>

                            </div>
                        </div>


                        {/* row 4 note,  sub total,  tax, grand total  */}
                        <div className="print-border-none px-5 border-b flex justify-between ">
                            <div className="flex flex-col print-text-12px mt-4 w-[80%]">
                                <label className="font-semibold text-black mt-3 px-2">Notes</label>
                                <textarea
                                    name="note"
                                    value={formData.note}
                                    onChange={handleChange}
                                    className="rounded px-2 py-1 h-8 w-[100%]"
                                ></textarea>

                                <label className="font-semibold text-black mt-3 px-2">Terms</label>
                                <input
                                    type="text"
                                    name="paymentTerms"
                                    value={formData.paymentTerms}
                                    placeholder=""
                                    onChange={handleChange}
                                    className="px-2 py-1 w-full"

                                />
                                <div className=" ">
                                    <label className="font-semibold text-black mt-3 px-2">Payment Date</label>
                                    <input
                                        type="text"
                                        name="billingAddress"
                                        value={formData.paymentDates}
                                        placeholder=""
                                        onChange={handleChange}
                                        className="px-2 py-1 w-full"

                                    />
                                </div>
                                <label className="font-semibold text-black mt-3 px-2">Payment Method</label>

                                <input
                                    type="text"
                                    name="payment Method"
                                    value={formData.paymentMethod}
                                    placeholder=""
                                    onChange={handleChange}
                                    className="px-2 py-1 w-full mb-4 "

                                />

                            </div>



                            <div className="w-full">

                                <div className="flex justify-end w-full gap-5">
                                    <div className="mt-1 flex flex-col gap-6 text font-semibold ">
                                        <label className="block mb-2 ">Subtotal:</label>
                                        <label className="block mb-2 ">Total Tax:</label>
                                        <label className="block mb-2 ">Grand Total:</label>
                                        <label className="block mb-2 ">Payment Paid:</label>
                                        <label className="block mb-2 ">Balance Due:</label>
                                        <label className="block mb-2  text-[12px]">{`(All Prices are shown in USD)`}</label>

                                    </div>

                                    <div className="flex flex-col gap-6 text font-semibold">

                                        <div className=" ">
                                            {/* <label className="block mb-2 ">Subtotal:</label> */}
                                            <input
                                                type="number"
                                                value={subtotal.toFixed(2)}
                                                name="subtotal"
                                                onChange={handleChange}
                                                readOnly
                                                className=" rounded px-2 py-1 "
                                            />
                                        </div>

                                        <div className="  ">
                                            {/* <label className="block mb-2 ">{`Total Tax:`}</label> */}
                                            <div className="">
                                                <input
                                                    type="number"
                                                    value={totalTax.toFixed(2)}
                                                    name="totalTax"
                                                    readOnly
                                                    onChange={handleChange}
                                                    className=" rounded px-2 py-1 "
                                                />
                                            </div>
                                        </div>
                                        <div className=" ">
                                            {/* <label className="block mb-2 ">Grand Total:</label> */}
                                            <input
                                                type="number"
                                                name="grandTotal"
                                                value={grandTotal.toFixed(2)}
                                                onChange={handleChange}
                                                readOnly
                                                className=" rounded px-2 py-1 "
                                            />

                                        </div>

                                        <div className=" ">
                                            {/* <label className="block mb-2 ">Payment Paid:</label> */}
                                            <input
                                                type="number"
                                                name="paymentPaid"
                                                value={formData.paymentPaid || grandTotal}
                                                onChange={handleChange}
                                                className=" rounded px-2 py-1 "


                                            />
                                        </div>
                                        <div className=" ">
                                            {/* <label className="block mb-2 ">Balance Due:</label> */}
                                            <input
                                                type="number"
                                                name="paymentDue"
                                                value={(grandTotal - formData.paymentPaid).toFixed(2)}
                                                // onChange={paymentDueHandleChange}
                                                readOnly
                                                className=" rounded px-2 py-1 "
                                            />
                                        </div>




                                    </div>
                                </div>
                            </div>




                        </div>
                        <div className="flex justify-between items-start
">
                            <p className="w-1/2">
                                You are important to us. Your complete satisfaction is our intent. If you are happy with our service, tell all your friends. If you are disappointed, please tell us and we will do all in our power to make you happy.

                            </p>


                            <div className=" flex justify-end pr-32">
                                <button type="button"
                                    className="text-blue-500 underline"
                                    onClick={() => { setEditPayments(true) }}>
                                    Add/Edit Payments
                                </button>
                            </div>
                        </div>
                        {/* add payments plan/installments popup */}

                        {editPayments &&

                            (
                                <div
                                    className="fixed z-50 top-3 right-0 left-0 bottom-6 bg-white rounded-lg shadow-2xl p-10  border-b-slate-300 border-solid border-2 border-r-[#6539c0] border-l-[#6539c0] overflow-auto m-52"
                                    style={{ boxShadow: `0 25px 50px 600px rgba(0, 0, 0, 0.50)`, }}
                                >

                                    <button type="button"
                                        className="fixed top-10 right-60 hover:bg-blue-600 bg-blue-500  rounded-md px-3 py-1 font-semibold text-lg text-white"
                                        onClick={() => { setEditPayments(false) }}>
                                        Done
                                    </button>
                                    {/* <button type="button"
                    className="fixed top-10 right-60 bg-red-500 hover:bg-red-600  rounded-md px-3 py-1 font-semibold text-lg text-white"
                    onClick={() => { setEditPayments(false) }}>
                    X
                  </button> */}
                                    <div className="print-no-my print-text-12px grid grid-cols-9 gap-4 mb-4">


                                    </div>

                                    {formData.payments.map((payment, index) => (
                                        <div key={index} className=" flex justify-between border-b-4 py-2 mb-6">

                                            <div className="flex gap-5">
                                                <div className="flex flex-col gap-2 pt-2">
                                                    <label className="my-1">Date Paid</label>
                                                    {/* <label className="my-1">Out Standing Order Balance</label> */}
                                                    <label className="my-1">Order Payment Amount</label>


                                                </div>

                                                <div>
                                                    <div className=''>
                                                        <input
                                                            type="date"
                                                            name={`payments[${index}].datePaid`}
                                                            value={payment.datePaid}
                                                            onChange={(e) => handlePaymentChange(index, e)}
                                                            className="rounded px-2 py-1 my-1 w-full border-2"
                                                            placeholder='Date Paid'
                                                        />
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


                                                    <div className='flex items-center justify-center'>
                                                        <input
                                                            type="number"
                                                            name={`payments[${index}].orderPaymentAmount`}
                                                            value={payment.orderPaymentAmount}
                                                            onChange={(e) => handlePaymentChange(index, e)}
                                                            className="rounded px-2 py-1 my-1 w-full border-2"
                                                            placeholder='orderPaymentAmount'
                                                        />
                                                    </div>

                                                </div>
                                            </div>


                                            <div className="flex gap-5">
                                                <div className="flex flex-col gap-2 pt-2">
                                                    {/* <label className="my-1">Total Payment Amount</label> */}
                                                    {/* <label className="my-1">Refunded Amoung</label> */}
                                                    <label className="my-1">Payment Method</label>
                                                    {/* <label className="my-1">Payment Status</label> */}



                                                </div>

                                                <div>



                                                    {/* 
                          <div className='flex items-center justify-center'>
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



                                                    <div className='flex items-center justify-center'>
                                                        <input
                                                            type="text"
                                                            name={`payments[${index}].paymentMethod`}
                                                            value={payment.paymentMethod}
                                                            onChange={(e) => handlePaymentChange(index, e)}
                                                            className="rounded px-2 py-1 my-1 w-full border-2"
                                                            placeholder='Payment Method'
                                                        />

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
                                                        <button
                                                            type="button"
                                                            onClick={() => removePayment(index)}
                                                            className="no-print bg-red-500 hover:bg-red-600 m-1 text-white px-4 py-1 rounded "
                                                        >
                                                            X
                                                        </button>


                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    ))}

                                    <div className='flex items-center justify-center gap-5'>
                                        <label>{`Payment Terms:`}</label>
                                        <input
                                            type="text"
                                            name="paymentTerms"
                                            value={formData.paymentTerms}
                                            placeholder="Payment Terms"
                                            onChange={handleChange}
                                            className="rounded px-2 py-1 my-1 w-1/2 border-2"

                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={addPayment}
                                        className="no-print my-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                                    >
                                        Add Payment
                                    </button>
                                </div>
                            )}



                        <div className="no-print print-no-py print-no-my pt-10 px-5">
                            <button
                                type="submit"
                                className=" bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mx-3"

                            >
                                Update
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
                            <Link to={`/print/${id}`} target="_blank"
                                className=" my-3 mr-2 bg-transparent border-[2px] border-blue-500 hover:bg-blue-100 hover:text-black text-blue-700 font-bold px-[20px] py-[5px] rounded"
                            >
                                Print
                            </Link>





                            {responseMessage && (
                                <span
                                    className={`mt-4 ${responseMessage.startsWith("Error")
                                        ? "text-red-500"
                                        : "text-green-500"
                                        }`}
                                >
                                    {responseMessage}
                                </span>
                            )}
                        </div>



                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInvoiceQuote;
