import React from 'react'
import EditInvoiceQuote from '../components/EditInvoiceQuote'
import { useParams } from 'react-router-dom';


const Edit = () => {

    const { id } = useParams();
    console.log(id)

    return (<>


            <div className="mx-auto max-w-5xl py-12">
            <EditInvoiceQuote id={id} />
                </div>



    </>

    )
}

export default Edit
