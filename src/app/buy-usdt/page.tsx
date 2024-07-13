'use client';

import { useState, useEffect } from "react";

import Image from "next/image";



// open modal

import Modal from '../../components/modal';

import { useRouter }from "next//navigation";





const P2PTable = () => {

    const router = useRouter();


  const data = [
    { advertiser: 'SeverskiY', trades: 60, price: 1354.82, available: '7.24 USDT', limit: '630.00 KRW - 630.00 KRW', paymentMethods: ['Bank', 'Tinkoff', 'SBP-Fast Bank Transfer'] },
    { advertiser: 'Iskan9', trades: 318, price: 1355.17, available: '1085.91 USDT', limit: '40680.00 KRW - 99002.9 KRW', paymentMethods: ['Tinkoff'] },
    { advertiser: 'Rusik163', trades: 946, price: 1365.35, available: '31.23 USDT', limit: '1019.00 KRW - 2853.23 KRW', paymentMethods: ['Raiffeisenbank'] },
    { advertiser: 'Dimasik10', trades: 723, price: 1373.16, available: '125.81 USDT', limit: '10280.00 KRW - 11594.86 KRW', paymentMethods: ['Raiffeisenbank'] },
    { advertiser: 'Soliev_03', trades: 137, price: 1345.33, available: '2922.37 USDT', limit: '82400.00 KRW - 269822.98 KRW', paymentMethods: ['Raiffeisenbank'] },
  ];

  /*
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Advertiser (Completion rate)</th>
            <th className="px-4 py-2 border-b">Price</th>
            <th className="px-4 py-2 border-b">Limit/Available</th>
            <th className="px-4 py-2 border-b">Payment method</th>
            <th className="px-4 py-2 border-b">Trade</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">
                <span className={`inline-block w-2 h-2 rounded-full ${item.trades > 300 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className="ml-2">{item.advertiser}</span>
                <span className="ml-2 text-gray-500">{item.trades} trades</span>
              </td>
              <td className="px-4 py-2">{item.price} KRW</td>
              <td className="px-4 py-2">{item.limit} <br /> {item.available}</td>
              <td className="px-4 py-2">
                {item.paymentMethods.map((method, idx) => (
                  <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 rounded-full mr-2 mb-1">{method}</span>
                ))}
              </td>
              <td className="px-4 py-2 text-green-500 cursor-pointer">Buy USDT</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
    */

  /*
        <article>
        <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
        <p className="text-sm text-zinc-400">{props.description}</p>
      </article>
    */

    const [isModalOpen, setModalOpen] = useState(false);

    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    const goChat = () => {
        console.log('Go Chat');
        router.push(`/chat?tradeId=12345`);
    }

    
    return (
        <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">

            <div className="py-20 w-full">

                {/* memnu: home, buy, sell, p2p, wallet, settings */}

                <div className="flex justify-center space-x-4 mb-10">
                    <a href="/" className="text-zinc-100 font-semibold">Home</a>
                    <a href="/buy-usdt" className="text-zinc-100 font-semibold">Buy</a>
                    <a href="/sell-usdt" className="text-zinc-100 font-semibold">Sell</a>
                    <a href="/" className="text-zinc-100 font-semibold">Wallet</a>
                    <a href="/" className="text-zinc-100 font-semibold">Settings</a>
                </div>




                <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
                    Buy USDT
                </h1>

                <div className="grid gap-4 lg:grid-cols-3 justify-center">

                    {data.map((item, index) => (

                        <article
                            key={index}
                            className="bg-black p-4 rounded-md border border-gray-200 ">
                            
                            <h2 className="text-lg font-semibold mb-2">{item.advertiser}</h2>

                            <p className="text-sm text-zinc-400">{item.trades} trades</p>

                            <p className="text-xl font-bold text-zinc-400">{item.price} KRW</p>
                            
                            {/*
                            <p className="text-sm text-zinc-400">{item.available} <br /> {item.limit}</p>
                            */}
                            {/*
                            Available: 7.24 USDT
                            Limit: 630.00 KRW - 630.00 KRW
                            */}
                            <div className="flex flex-col">
                                <p className="text-sm text-zinc-400">Available: {item.available}</p>
                                <p className="text-sm text-zinc-400">Limit: {item.limit}</p>
                            </div>

                            <p className="text-sm text-zinc-400">
                                {item.paymentMethods.map((method, idx) => (
                                    <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 rounded-full mr-2 mb-1">{method}</span>
                                ))}
                            </p>
                            {/*
                            <p className="text-lg text-green-500 cursor-pointer">
                                Buy USDT
                            </p>
                            */}
                            <button
                                className="text-lg bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                                onClick={() => {
                                    console.log('Buy USDT');

                                    // open trade detail
                                    // open modal of trade detail



                                    openModal();


                               

                                }}
                            >
                                Buy USDT
                            </button>

                        </article>

                    ))}

                </div>

            
            </div>


            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <TradeDetail
                    closeModal={closeModal}
                    goChat={goChat}
                />
            </Modal>


        </main>

    );


};






// close modal

const TradeDetail = (
    {
        closeModal = () => {},
        goChat = () => {},
        
    }
) => {


    const [amount, setAmount] = useState(1000);
    const price = 91.17; // example price
    const receiveAmount = (amount / price).toFixed(2);
    const commission = 0.01; // example commission
  
    return (
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
          <h2 className="text-lg font-semibold text-black ">Iskan9</h2>
          <span className="ml-2 text-blue-500 text-sm">318 trades</span>
        </div>
        <p className="text-gray-600 mt-2">The offer is taken from another source. You can only use chat if the trade is open.</p>
        
        <div className="mt-4">
          <div className="flex justify-between text-gray-700">
            <span>Price</span>
            <span>{price} KRW</span>
          </div>
          <div className="flex justify-between text-gray-700 mt-2">
            <span>Limit</span>
            <span>40680.00 KRW - 99002.9 KRW</span>
          </div>
          <div className="flex justify-between text-gray-700 mt-2">
            <span>Available</span>
            <span>1085.91 USDT</span>
          </div>
          <div className="flex justify-between text-gray-700 mt-2">
            <span>Seller&apos;s payment method</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 rounded-full">Tinkoff</span>
          </div>
          <div className="mt-4 text-gray-700">
            <p>24/7</p>
          </div>
        </div>
  
        <div className="mt-6 border-t pt-4 text-gray-700">
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-gray-700">I want to pay</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(
                    e.target.value === '' ? 0 : parseInt(e.target.value)
                ) }

                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700">I will receive</label>
              <input 
                type="text"
                value={`${receiveAmount} USDT`}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700">Commission</label>
              <input 
                type="text"
                value={`${commission} USDT`}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => {
                    console.log('Buy USDT');
                    // go to chat
                    // close modal
                    closeModal();
                    goChat();

                }}
            >
                Buy USDT
            </button>
            <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                onClick={() => {
                    console.log('Cancel');
                    // close modal
                    closeModal();
                }}
            >
                Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };




export default P2PTable;
