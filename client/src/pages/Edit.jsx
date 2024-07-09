import React from 'react'
import EditInvoiceQuote from '../components/EditInvoiceQuote'
import { useParams } from 'react-router-dom';


const Edit = () => {

    const { id } = useParams();
    console.log(id)

    return (<>
   <p className='text-gradient-to-r from-blue-500 to-purple-600 flex justify-center text-2xl p-5 m-2'>EDIT</p>

        <div className='bg-gray-100'>

            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto max-w-5xl">
                    <EditInvoiceQuote id={id} />
                </div>
            </div>


        </div>

</>

    )
}

export default Edit
