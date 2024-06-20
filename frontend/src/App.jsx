import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import List from './components/List';
import Order from './components/Order';
import axios from 'axios';
import { API_URL } from './components/config';

function App() {
  const [Phone, setPhone] = useState("");
  const [ordersRes, setOrdersRes] = useState([]);
  const dataFetch = async () => {
    try {
      console.log(Phone);
      const numericString = Phone.replace(/\D/g, '');
      console.log(numericString);
      const rightmost10Digits = numericString.slice(-10);
      setPhone(rightmost10Digits);
      const response = await axios.post(`${API_URL}/getOrders`, { phone: Phone });
      // console.log(response.data);
      setOrdersRes(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home Phone={Phone} setPhone={setPhone} dataFetch={dataFetch} />} />
        <Route path="/list" element={<List Phone={Phone} setPhone={setPhone} dataFetch={dataFetch} ordersRes = {ordersRes}/>} />
        <Route path="/order/:order_number" element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
