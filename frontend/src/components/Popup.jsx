// src/components/Popup.js
import React, { useEffect, useRef } from 'react';

const Popup = ({ show, onClose , data }) => {

  const handleExchange = () => {
    window.open("https://api.whatsapp.com/send?phone=917726915904&text=Help", '_blank');
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div ref={popupRef} className="bg-white p-4 rounded shadow-lg">
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="mt-4">
            <p className='text-center m-4 text-2xl' >{data.order_number}</p>
            <div className='flex'>
                <a href={data.status_url}><button className='bg-black text-white m-2 p-2 px-5 rounded-full'>Details</button></a>
                <button className='bg-black text-white m-2 p-2 px-5 rounded-full' onClick={handleExchange}>Exchange/Return</button>
            </div>          

        </div>
      </div>
    </div>
  );
};

export default Popup;
