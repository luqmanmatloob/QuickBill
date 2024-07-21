import React, { useState } from 'react';

function Test() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };















  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   const updatedFormData = { ...formData, [name]: value };
  //   setFormData(updatedFormData);
  // };



  return (
    // <input
    //   type="date"
    //   name="dateOrdered"
    //   placeholder="Order Date"
    //   value={formData.dateOrdered}
    //   onChange={handleChange}
    //   className="px-2 py-1 my-1 w-full"

    // />
    <div></div>
  );
}















export default Test;
