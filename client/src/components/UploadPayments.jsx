import React from 'react'

const UploadPayments = () => {
  return (
    <div className="mt-28 mx-full">
      <h1 className='text-red-600 text-center'>upload payments component (under develpment)</h1>
    </div>
  )
}

export default UploadPayments




// user clicks on upload Payment 

// it takes the csv file 

// parses the csv file and dependng on the invoice number it updates the payment in their perspective mongo collection 

// then it fetches all  the uploaded payments and shows them on screen as table and user can edit them (just like uplaod invoice)

// when click on edit he will go to edit invoice page where he will update the entire invoice 

// and if the invoice number does not exist for any payment it will show that on screen and tell that for this invoice odnt exist and will ignore it
