import React from 'react';
import SearchButton from './SearchButton';

function Home({ Phone, setPhone, dataFetch }) {
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-200">
            <div className="flex justify-center p-6">
                <a href="https://shop.thrd.store/">
                    <img src="//shop.thrd.store/cdn/shop/files/black.png?" className="w-24" alt="Logo" />
                </a>
            </div>
            <div className="w-full px-4">
                <h1 className="text-4xl m-5 my-14 text-center">
                    <strong>
                        Find Your
                        <br />
                        Orders
                    </strong>
                </h1>
                <div className="m-5 mt-14 flex flex-col items-center">
                    <label htmlFor="phone-input" className="text-lg mb-2">Phone No</label>
                    <input
                        id="phone-input"
                        value={Phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="number"
                        className="border-2 border-gray-300 p-2 rounded-md text-center w-80 max-w-sm focus:outline-none focus:border-black"
                        placeholder="Phone Number"
                    />
                </div>
                <div className="flex justify-center mt-8">
                    <SearchButton Phone={Phone} dataFetch={dataFetch} style="p-4 px-8 rounded-full bg-black text-white w-64 text-center" className="w-64"/>
                </div>
            </div>
        </div>
    );
}

export default Home;
