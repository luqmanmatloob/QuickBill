import React from 'react'
import InvoiceForm from '../components/InvoiceForm';
import InvoiceManagement from '../components/InvoiceManagement'


const Home = () => {
  return (
    <div>

      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-5xl">
          <InvoiceForm />
        </div>
      </div>

      <div className='mb-[100vw]'>

        <InvoiceManagement />
      </div>


    </div>
  )
}

export default Home
