'use client';


import { useState, useEffect, use } from "react";



import { toast } from 'react-hot-toast';

import { client } from "../client";

import {
    getContract,
    sendAndConfirmTransaction,
} from "thirdweb";



import {
    polygon,
} from "thirdweb/chains";

import {
    ConnectButton,
    useActiveAccount,
    useActiveWallet,
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";


import { getUserPhoneNumber } from "thirdweb/wallets/in-app";


import Image from 'next/image';

import GearSetupIcon from "@/components/gearSetupIcon";


import Uploader from '@/components/uploader';

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 






// open modal

import Modal from '../../components/modal';

import { useRouter }from "next//navigation";



interface SellOrder {
  _id: string;
  createdAt: string;
  nickname: string;
  trades: number;
  price: number;
  available: number;
  limit: string;
  paymentMethods: string[];

  usdtAmount: number;
  krwAmount: number;
  rate: number;

  seller: any;

  status: string;

  acceptedAt: string;
  paymentRequestedAt: string;
  paymentConfirmedAt: string;

  tradeId: string;

  buyer: any;
}





const wallets = [
  inAppWallet({
    auth: {
      options: ["phone"],
    },
  }),
];



const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon


// get a contract
const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: polygon,
  // the contract's address
  address: contractAddress,
  // OPTIONAL: the contract's abi
  //abi: [...],
});



const P2PTable = () => {





  const smartAccount = useActiveAccount();

  const address = smartAccount?.address || "";




  const [balance, setBalance] = useState(0);



  useEffect(() => {

    // get the balance
    const getBalance = async () => {
      const result = await balanceOf({
        contract,
        address: address,
      });
  
      //console.log(result);
  
      setBalance( Number(result) / 10 ** 6 );

    };

    if (address) getBalance();

    const interval = setInterval(() => {
      if (address) getBalance();
    } , 1000);

  } , [address]);






    const router = useRouter();


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






    
    const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);


    useEffect(() => {

        if (!address) {
          return;
        }
        
        const fetchSellOrders = async () => {
          // api call
          const response = await fetch('/api/order/getSellTrades', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              walletAddress: address
            })
          });
  
          const data = await response.json();
  
          ///console.log('data', data);
  
          if (data.result) {
            setSellOrders(data.result.orders);
          }
  
        };
  
        fetchSellOrders();
  
    }, [address]);





    const [isModalOpen, setModalOpen] = useState(false);

    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    const goChat = (
      tradeId: string
    ) => {
        console.log('Go Chat');
        router.push(`/chat?tradeId=${tradeId}`);
    }


    const [usdtAmount, setUsdtAmount] = useState(0);
    const [krwAmount, setKrwAmount] = useState(0);

    console.log('usdtAmount', usdtAmount);


    useEffect(() => {

      if (usdtAmount === 0) {
        setKrwAmount(0);
        return;
      }
    
        
      setKrwAmount( Math.round(usdtAmount * 1355.17) );

    } , [usdtAmount]);


    const [sellOrdering, setSellOrdering] = useState(false);

    const sellOrder = async () => {
      // api call
      // set sell order

      if (sellOrdering) {
        return;
      }

      setSellOrdering(true);

      const response = await fetch('/api/order/setSellOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          usdtAmount: usdtAmount,
          krwAmount: krwAmount,
          rate: 1355.17
        })
      });

      const data = await response.json();

      //console.log('data', data);

      if (data.result) {
        toast.success('Sell order has been created');

        setUsdtAmount(0);


        await fetch('/api/order/getSellOrders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            walletAddress: address
          })
        }).then(async (response) => {
          const data = await response.json();
          //console.log('data', data);
          if (data.result) {
            setSellOrders(data.result.orders);
          }
        });




      } else {
        toast.error('Sell order has been failed');
      }

      setSellOrdering(false);

      

    };


    const [requestingPayment, setRequestingPayment] = useState(false);

    const requstPayment = async (
      orderId: string,
      tradeId: string,
      amount: number,
    ) => {
      // check balance
      // send payment request

      if (balance < amount) {
        toast.error('Insufficient balance');
        return;
      }


      if (requestingPayment) {
        return;
      }

      setRequestingPayment(true);


   

      const recipientWalletAddress = "0x7B773C495b91EEC3c549C7f811d5c53241CeF41f";

      // send USDT
      // Call the extension function to prepare the transaction
      const transaction = transfer({
        contract,
        to: recipientWalletAddress,
        amount: amount,
      });
      

      const transactionResult = await sendAndConfirmTransaction({
          transaction: transaction,
          
          account: smartAccount as any,
      });

      console.log(transactionResult);



      // send payment request

      if (transactionResult) {

      
        const response = await fetch('/api/order/requestPayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: orderId,
          })
        });

        const data = await response.json();

        console.log('data', data);

        if (data.result) {




          const response = await fetch('/api/order/getSellTrades', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              walletAddress: address
            })
          });
  
          const data = await response.json();
  
          ///console.log('data', data);
  
          if (data.result) {
            setSellOrders(data.result.orders);
          }
          


          // refresh balance

          const result = await balanceOf({
            contract,
            address: address,
          });

          //console.log(result);

          setBalance( Number(result) / 10 ** 6 );


          toast.success('Payment request has been sent');
        } else {
          toast.error('Payment request has been failed');
        }

      }
      

      setRequestingPayment(false);

    }



    const [confirmingPayment, setConfirmingPayment] = useState(false);

    const confirmPayment = async (
      orderId: string
    ) => {
      // confirm payment
      // send usdt to buyer wallet address

      if (confirmingPayment) {
        return;
      }

      setConfirmingPayment(true);

      const response = await fetch('/api/order/confirmPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderId,
        })
      });

      const data = await response.json();

      //console.log('data', data);

      if (data.result) {

        const response = await fetch('/api/order/getSellTrades', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            walletAddress: address
          })
        });

        const data = await response.json();

        ///console.log('data', data);

        if (data.result) {
          setSellOrders(data.result.orders);
        }

        toast.success('Payment has been confirmed');
      } else {
        toast.error('Payment has been failed');
      }

      setConfirmingPayment(false);
    }



    
    return (

      <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

        <div className="py-20 w-full">
  
          {/* goto home button using go back icon
          history back
          */}
  
          <div className="flex justify-start space-x-4 mb-10">
              <button onClick={() => window.history.back()} className="text-zinc-100 font-semibold">Go Back</button>
          </div>


          <div className="flex flex-col gap-5 items-start justify-center ">

                <div className='flex flex-row items-center space-x-4'>
                  <Image
                      src="/trade-sell.png"
                      alt="USDT"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  <div className="text-2xl font-semibold">My Sell USDT Trades</div>

                  {!address && (
                    <ConnectButton

                        client={client}

                        wallets={wallets}
                        
                        accountAbstraction={{        
                        chain: polygon,
                        //chain: arbitrum,
                        factoryAddress: "0x9Bb60d360932171292Ad2b80839080fb6F5aBD97", // polygon, arbitrum
                        gasless: true,
                        }}
                        
                        theme={"light"}
                        connectModal={{
                        size: "wide",


                        }}


                        
                        appMetadata={
                        {
                            logoUrl: "https://next.unove.space/logo.png",
                            name: "Next App",
                            url: "https://next.unove.space",
                            description: "This is a Next App.",

                        }
                        }

                    />
                  )}
                </div>



                {/* my usdt balance */}
                <div className="flex flex-col gap-2 items-start">
                  <div className="text-sm">My Balance</div>
                  <div className="text-5xl font-semibold text-white">
                    {Number(balance).toFixed(2)} <span className="text-lg">USDT</span>
                  </div>
                </div>


                <div className="w-full grid gap-4 lg:grid-cols-3 justify-center">





                    {sellOrders?.map((item, index) => (

                        <article
                            key={index}
                            className="w-96 xl:w-full bg-black p-4 rounded-md border border-gray-200 ">

                            { (item.status === 'accepted' || item.status === 'paymentRequested' || item.status === 'paymentConfirmed') && (
                              <p className="text-lg text-green-500">
                                TID: {item.tradeId}
                              </p>
                            )}

                            <p className="mt-5 text-sm text-zinc-400">
                              Accepted at {
                                new Date(item.acceptedAt).toLocaleDateString() + ' ' + new Date(item.acceptedAt).toLocaleTimeString()
                              }
                            </p>
                          
                            <p className="text-2xl font-bold text-white">{item.usdtAmount} USDT</p>

                            {/*
                            <p className="text-xl font-bold text-zinc-400">Rate: 1 USDT = {item.rate} KRW</p>
                            */}

                            <p className="mb-5 text-xl font-bold text-zinc-400"> Price: {item.krwAmount} KRW</p>
                            

                            {/*
                            <p className="text-xl font-semibold text-white">
                              Status: {item.status?.toUpperCase()}
                            </p>
                            */}

                            {item.status === 'paymentConfirmed' && (
                              <div className="w-full flex flex-col items-start gap-2">
                                <div className="flex flex-row items-center gap-2">
                                  <div className="text-lg font-semibold text-red-500">
                                    - {item.usdtAmount} USDT
                                  </div>
                                  <div className="text-lg font-semibold text-white">
                                    /
                                  </div>
                                  <div className="text-lg font-semibold text-green-500">
                                    + {item.krwAmount} KRW
                                  </div>
                                </div>

                              </div>
                            )}
     


                            { (item.status === 'paymentRequested' || item.status === 'paymentConfirmed')
                              && (

                              <div className="w-full flex flex-col items-start gap-2">

                                {item.paymentConfirmedAt && (
                                  <p className="text-sm font-semibold text-green-500">
                                    Completed at {new Date(item.paymentConfirmedAt).toLocaleDateString() + ' ' + new Date(item.paymentConfirmedAt).toLocaleTimeString()}
                                  </p> 
                                )}                               

                                <p className="text-sm  text-gray-400">
                                  Pay rqsted at {new Date(item.paymentRequestedAt).toLocaleDateString() + ' ' + new Date(item.paymentRequestedAt).toLocaleTimeString()}
                                </p>

                                <p className="text-xl text-green-500">
                                  Payment Information
                                </p>

                                <div className="flex flex-col gap-2 text-sm text-left text-white">
                                            
                                  <ul>
                                    <li>
                                      {item.seller.bankInfo.bankName} {item.seller.bankInfo.accountNumber} {item.seller.bankInfo.accountHolder}
                                    </li>
                                    <li>Amount : {item.krwAmount} KRW</li>
                                    {/* 입금자명 표시 */}
                                    <li>Deposit Name : {item.tradeId}</li>
                                  </ul>

                                </div>

                              </div>
                            )}

                            {item.status === 'accepted' && (
                              <p className="text-sm text-zinc-400">
                                Accepted at {new Date(item.acceptedAt).toLocaleDateString() + ' ' + new Date(item.acceptedAt).toLocaleTimeString()}
                              </p>
                            )}


                            {item.status === 'paymentConfirmed' && (
                              <p className="mt-5 text-xl text-green-500">
                                Buyer: {item.buyer.nickname}
                              </p>
                            )}


                            {(item.status === 'accepted' || item.status === 'paymentRequested') && (
                                <div className="w-full mt-2 mb-2 flex flex-col items-start ">

                                  <div className="flex flex-row items-center gap-2">
                    

                                    
                                      <button
                                          disabled={
                                            item.status === 'accepted' &&
                                            balance < item.usdtAmount
                                          }
                                          className={`
                                              w-full text-lg mt-5
                                              ${ (item.status === 'accepted' && balance < item.usdtAmount) ? 'bg-gray-500' : 'bg-green-500'}
                                              text-white px-4 py-2 rounded-md`}

                                          onClick={() => {
                                              //console.log('Buy USDT');
                                              // go to chat
                                              // close modal
                                              //closeModal();
                                              goChat(item.tradeId);

                                          }}
                                      >
                                          Chat with Buyer 
                                          {
                                             balance >=item.usdtAmount && item.buyer.nickname && (
                                            <span className="text-sm text-white ml-2">({item.buyer.nickname})</span>
                                          )}
                                          

                                      </button>

                                  </div>
                                 

                         

                                  {item.status === 'accepted' && (


                                      <button
                                          disabled={balance < item.usdtAmount || requestingPayment}
                                          className={`w-full text-lg
                                            ${balance < item.usdtAmount ? 'bg-red-500' : 'bg-blue-500'}
                                            
                                          text-white px-4 py-2 rounded-md mt-4`}

                                          onClick={() => {
                                              console.log('request Payment');
                                              
                                              ///router.push(`/chat?tradeId=12345`);

                                              requstPayment(
                                                item._id,
                                                item.tradeId,
                                                item.usdtAmount,
                                              );

                                          }}
                                      >

                                        {balance < item.usdtAmount ? (

                                          <div className="flex flex-col gap-2">
                                            <div className="flex flex-row items-center gap-2">
                                              <GearSetupIcon />
                                              <div className="text-lg font-semibold">
                                              Request Payment
                                              </div>
                                            </div>
                                            <div className="text-lg text-white">
                                              Insufficient Balance
                                            </div>
                                            <div className="text-lg text-white">
                                              You need {item.usdtAmount} USDT
                                            </div>
                                            <div className="text-lg text-white">
                                              You have {balance} USDT
                                            </div>
                                            <div className="text-lg text-white">
                                              Please top up your balance by depositing {item.usdtAmount - balance} USDT
                                            </div>
                                            <div className="text-lg text-white">
                                              Your wallet address is
                                            </div>
                                            <div className="text-xs text-white">
                                              {address.substring(0, 10)}...{address.substring(address.length - 10, address.length)}
                                              
                                            </div>
                                            <div className="text-xs text-white">
                                            
                                              <button
                                                  onClick={() => {
                                                      navigator.clipboard.writeText(address);
                                                      toast.success('Address has been copied');
                                                  }}
                                              className="text-xs bg-green-500 text-white px-2 py-1 rounded-md">Copy</button>
                                            </div>
                                          </div>

                                        ) : (

                                          <div className="flex flex-col gap-2">

                                            <div className="flex flex-row items-center gap-2">
                                              <GearSetupIcon />
                                              <div className="text-lg font-semibold">
                                              Request Payment
                                              </div>
                                            </div>

                                            <div className="flex flex-col gap-2 text-sm text-left text-white">
                                              <ul>
                                                <li>
                                                  {item.seller.bankInfo.bankName} {item.seller.bankInfo.accountNumber} {item.seller.bankInfo.accountHolder}
                                                </li>
                                                <li>Amount : {item.krwAmount} KRW</li>
                                                <li>Deposit Name : {item.tradeId}</li>
                                              </ul>
                                            </div>

                                          </div>
                                        )}


                                      </button>

                                  

                                  )}

                                </div>
                            )}


                    

                            {item.status === 'paymentRequested' && (

                              
                              <button
                                  disabled={confirmingPayment}
                                  className="w-full text-lg bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                                  onClick={() => {
                                      console.log('Canfirm Payment');

                                      //toast.success('Payment has been confirmed');

                                      confirmPayment(item._id);
                                      
                                  }}
                              >
                                Confirm Payment
                              </button>
                            )}






                        </article>

                    ))}

                </div>

            </div>

            
          </div>


          <Modal isOpen={isModalOpen} onClose={closeModal}>
              <TradeDetail
                  closeModal={closeModal}
                  goChat={
                    () => {
                      goChat('12345');
                    }
                  }
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
