import React from 'react'
import Invoice from '../components/Invoice';
import InvoiceManagement from '../components/InvoiceManagement'
import Test from '../components/Test';


const Home = () => {
  return (
    <div className='bg-gray-100'>

      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-5xl">
          <Invoice />
        </div>
      </div>



      <div className='mt-[50vw] '>

        <InvoiceManagement />
      </div> 
      
      
      
      
      
      
      <div className=''>

        <Test />
      </div>


    </div>
  )
}

export default Home
