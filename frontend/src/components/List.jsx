import React, { useEffect } from 'react';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';

function List({ Phone, setPhone, dataFetch, ordersRes }) {
  const [orders, setOrders] = React.useState([]);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState("");
  const options = { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric'
  };
  
  useEffect(() => {
    console.log(ordersRes);

    ordersRes.sort((a, b) => b.order_number - a.order_number);

    const findStatus = (cancelled, fulfilled) => {
      if (cancelled !== "false") {
        return 'Cancelled';
      } else if (fulfilled != null) {
        return 'Shipped';
      }
      return 'Pending';
    }

    const handleOrderClick = (e, orderNumber) => {
      let clickedOrder = ordersRes.find(order => order.order_number === orderNumber);
      console.log(clickedOrder);
      setSelectedOrder(clickedOrder);
      window.open(clickedOrder.status_url, '_blank');
    };
    const handleExchangeClick = (e, orderNumber) => {
      let clickedOrder = ordersRes.find(order => order.order_number === orderNumber);
      console.log(`https://api.whatsapp.com/send?phone=917726915904&text=I would like to return / exchange for order: ${clickedOrder.order_number}`);
      window.open(`https://api.whatsapp.com/send?phone=917726915904&text=I would like to return / exchange for order: ${clickedOrder.order_number}`, '_blank');
    };
    setOrders(ordersRes.map((order, index) => (
      <div key={index} className={'mx-5 border-b-2 p-1 bg-gray-50 m-2 rounded-2xl'}>
        <div className="w-full p-4"
          style={{ cursor: 'pointer' }}>
          <div className="flex justify-between m-3 ">
            <p className='text-3xl'>{order.order_number}</p>
            <p className='text-lg'>{findStatus(order.cancelled, order.fullfilment_status)}</p>
          </div>
          <div className='my-3'>
            <p className='my-3'>Total : ₹ {Math.round(order.price)}</p>
            <p className='my-3'>Ordered On  : {new Date(order.created_at).toLocaleString('en-US', options)}</p>            
          </div>
          <div className='flex justify-between my-3'> 
            <button onMouseDown={(e) => handleExchangeClick(e, order.order_number)} className='bg-black text-white p-2 px-8 rounded-full text-lg focus:outline-none'><strong>Return</strong></button>
            <button onMouseDown={(e) => handleOrderClick(e, order.order_number)} className='bg-black text-white p-2 px-8 rounded-full focus:outline-none'><strong>Details</strong></button>
          </div>
        </div>
      </div>
    )));
  }, [ordersRes, navigate]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-gray-200">
        <SearchBar Phone={Phone} setPhone={setPhone} dataFetch={dataFetch} />
      </div>
      {orders.length === 0 ? null : (
        <div className="flex-grow overflow-auto">
          {orders}
        </div>
      )}
    </div>

  );
}

export default List;
