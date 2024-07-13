'use client';

import { useState, useEffect } from "react";

import Image from "next/image";



const P2PTable = () => {
  const data = [
    { advertiser: 'SeverskiY', trades: 60, price: 1354.82, available: '7.24 USDT', limit: '630.00 RUB - 630.00 RUB', paymentMethods: ['Bank', 'Tinkoff', 'SBP-Fast Bank Transfer', 'Paypal'] },
    { advertiser: 'Iskan9', trades: 318, price: 1355.17, available: '1085.91 USDT', limit: '40680.00 RUB - 99002.9 RUB', paymentMethods: ['Tinkoff'] },
    { advertiser: 'Rusik163', trades: 946, price: 1365.35, available: '31.23 USDT', limit: '1019.00 RUB - 2853.23 RUB', paymentMethods: ['Raiffeisenbank'] },
    { advertiser: 'Dimasik10', trades: 723, price: 1373.16, available: '125.81 USDT', limit: '10280.00 RUB - 11594.86 RUB', paymentMethods: ['Raiffeisenbank'] },
    { advertiser: 'Soliev_03', trades: 137, price: 1345.33, available: '2922.37 USDT', limit: '82400.00 RUB - 269822.98 RUB', paymentMethods: ['Raiffeisenbank'] },
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
              <td className="px-4 py-2">{item.price} RUB</td>
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

    /* background-color: #f7f7f7; */

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
                            Limit: 630.00 RUB - 630.00 RUB
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
                            <button className="text-lg bg-green-500 text-white px-4 py-2 rounded-md mt-4">
                                Buy USDT
                            </button>

                        </article>

                    ))}

                </div>

            
            </div>

        </main>

    );


};

export default P2PTable;
