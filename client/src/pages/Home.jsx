import React from 'react'
import Invoice from '../components/Invoice';


const Home = () => {
  return (
    <div className='bg-gray-100'>

      <div className="min-h-screen bg-gray-100">
        <div className="mx-auto max-w-5xl">
          <Invoice />
        </div>
      </div>


    </div>
  )
}

export default Home
