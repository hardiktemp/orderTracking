import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming axios is installed
import { useParams } from 'react-router-dom'; // For accessing URL parameters
import { API_URL } from './config'; 

const OrderDetailsPage = () => {
  const { order_number } = useParams(); // Get order number from URL parameter
  const [order, setOrder] = useState(null); // State to store order details

  useEffect(() => {
    // Function to fetch order details based on order number
    console.log(order_number);
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.post(`${API_URL}/getOrderDetails` , {order_number : order_number}); // Replace with your API endpoint
        setOrder(response.data); // Set fetched order details to state
      } catch (error) {
        console.error('Error fetching order details:', error);
        // Handle error
      }
    };

    fetchOrderDetails(); // Call fetchOrderDetails when component mounts
  }, [order_number]); // Depend on orderNumber to refetch when URL parameter changes

  if (!order) {
    return <p>Loading...</p>; // Render loading indicator while fetching data
  }

  return (
    <div className="order-details-container">
      <h1>Order Details</h1>
      <p><strong>Order Number:</strong> {order.order_number}</p>
      <p><strong>Phone:</strong> {order.phone}</p>
      <p><strong>Price:</strong> ${order.price}</p>
      <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>
      <p><strong>Financial Status:</strong> {order.financial_status}</p>
      <p><strong>Fulfillment Status:</strong> {order.fullfilment_status}</p>

      <h2>Products:</h2>
      <ul>
        {order.products.map((product, index) => (
          <li key={index}>
            <image src={product.images[0]} alt={product.name} />
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Quantity:</strong> {product.quantity}</p>
            <p><strong>ID:</strong> {product.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetailsPage;
