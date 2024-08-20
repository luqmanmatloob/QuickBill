import React from 'react';
import Print from '../components/print';
import { useParams } from 'react-router-dom';

const PrintPage = () => {
  const { id } = useParams();
  const selectedInvoices = id.split(',').map(Number);

  return (
    <>
      <Print id={selectedInvoices} />
    </>
  );
};

export default PrintPage;
