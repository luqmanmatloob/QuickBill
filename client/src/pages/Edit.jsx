import React from 'react'
import EditInvoiceQuote from '../components/EditInvoiceQuote'
import { useParams } from 'react-router-dom';


const Edit = () => {

    const { id } = useParams();
    console.log(id)

    return (<>
        <h2 className='bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent flex justify-center text-2xl p-5 m-2 mt-3 font-semibold'>
            EDIT
        </h2>

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
