'use client';

import { useState, useEffect, use } from "react";

import Image from "next/image";



// open modal

import Modal from '../../components/modal';

import { useRouter }from "next//navigation";


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







interface SellOrder {
  _id: string;
  createdAt: string;
  walletAddress: string;
  nickname: string;
  avatar: string;
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

  const router = useRouter();



  const smartAccount = useActiveAccount();

  const address = smartAccount?.address || "";


  console.log('address', address);


  // get User by wallet address

  const [user, setUser] = useState<any>(null);
  useEffect(() => {

    if (!address) {
        return;
    }

    fetch('/api/user/getUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            walletAddress: address,
        }),
    })
    .then(response => response.json())
    .then(data => {
        //console.log('data', data);
        setUser(data.result);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  } , [address]);






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

    const goChat = (
      tradeId: string
    ) => {
        console.log('Go Chat');
        router.push(`/chat?tradeId=${tradeId}`);
    }

    

    
    const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);

    useEffect(() => {
        fetch('/api/order/getBuyTrades', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress: address,
            }),
        })
        .then(response => response.json())
        .then(data => {
            
            //console.log('data', data);

            setSellOrders(data.result.orders);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } , [address]);


    const [acceptingSellOrder, setAcceptingSellOrder] = useState(false);

    const acceoptSellOrder = (orderId: string) => {

        if (!user) {
            return;
        }

        setAcceptingSellOrder(true);

        fetch('/api/order/acceptSellOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                orderId: orderId,
                buyerWalletAddress: user.walletAddress,
                buyerNickname: user.nickname,
                buyerAvatar: user.avatar,
                buyerMobile: user.mobile,
            }),
        })
        .then(response => response.json())
        .then(data => {

            console.log('data', data);

            //setSellOrders(data.result.orders);
            //openModal();

            toast.success('Order accepted successfully');



            fetch('/api/order/getAllSellOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                }),
            })
            .then(response => response.json())
            .then(data => {
                ///console.log('data', data);
                setSellOrders(data.result.orders);
            })





        })
        .catch((error) => {
            console.error('Error:', error);
        });

        setAcceptingSellOrder(false);
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


          <div className="flex flex-col items-start justify-center space-y-4">

              <div className='flex flex-row items-center space-x-4'>
                  <Image
                      src="/trade-buy.png"
                      alt="USDT"
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  <div className="text-2xl font-semibold">My Buy USDT Trades</div>




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


                <div className="w-full grid gap-4 lg:grid-cols-3 justify-center">

                    {sellOrders.map((item, index) => (

                        <article
                            key={index}
                            className=" w-96 xl:w-full
                            bg-black p-4 rounded-md border border-gray-200 ">

                            <p className="text-xl font-semibold text-green-500">
                              Trade ID: {item.tradeId}
                            </p>

                            {item.paymentRequestedAt && (
                              <p className="text-sm text-zinc-400">Pay rqsted at {
                                item.paymentRequestedAt && new Date(item.paymentRequestedAt).toLocaleString()
                              }</p>
                            )}

                            {item.status === 'paymentRequested' && (
                              <div className="mt-2 mb-2 flex flex-col gap-2 text-sm text-left bg-gray-800 p-4 rounded-md">
                                <p className="text-xl text-white font-semibold">
                                  Payment Infomation
                                </p>

                              
                                <ul>

                                  <li className="text-lg" >{item.seller.bankInfo.bankName} {item.seller.bankInfo.accountNumber} {item.seller.bankInfo.accountHolder}</li>
                                  <li className="text-lg">Amount : {item.krwAmount} KRW</li>
                                  
                                  <li className="mt-2">You must deposit to the above account using deposit name
                                    {' '}<span className="text-red-500 font-semibold text-lg">{item.tradeId}</span>
                                  </li>

                                  <li className="mt-2">
                                    After deposit, click the button below.
                                  </li>
                                </ul>

                                <button className="m-2 bg-green-500 text-white px-4 py-2 rounded-lg">
                                  Payment Completed
                                </button>
                              </div>
                            )}


                            {item.status === 'accepted' && (
                              <button className="mt-2 mb-2 bg-green-500 text-white px-4 py-2 rounded-lg">
                                Cancel Trade
                              </button>
                            )}




                            <p className="text-sm text-zinc-400">Accepted at {
                                item.createdAt && new Date(item.acceptedAt).toLocaleString()
                            }</p>
                           
                            <p className="text-sm text-zinc-400">Ordered at {
                                item.createdAt && new Date(item.createdAt).toLocaleString()
                            }</p>
                            
                            <p className="mt-2 mb-2 flex items-center gap-2">
                              <div className="flex items-center space-x-2">Seller: </div>
                              <Image
                                  src={item.avatar || '/profile-default.png'}
                                  alt="Avatar"
                                  width={38}
                                  height={38}
                                  priority={true} // Added priority property
                                  className="rounded-full"
                                  style={{
                                      objectFit: 'cover',
                                      width: '38px',
                                      height: '38px',
                                  }}
                              />
                              <h2 className="text-lg font-semibold text-green-500">
                                {item.nickname}
                              </h2>


                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => {
                                    //console.log('Buy USDT');
                                    // go to chat
                                    // close modal
                                    //closeModal();
                                    goChat(item.tradeId);

                                }}
                            >
                                Chat
                            </button>

                            </p>


                            <p className="text-2xl font-semibold text-white">{item.usdtAmount} USDT</p>

                            <p className="text-xl font-bold text-zinc-400">Price: {item.krwAmount} KRW</p>
                            
                            {/*
                            <p className="text-sm text-zinc-400">{item.available} <br /> {item.limit}</p>
                            */}
                            {/*
                            Available: 7.24 USDT
                            Limit: 630.00 KRW - 630.00 KRW
                           
                            <div className="flex flex-col">
                                <p className="text-sm text-zinc-400">Available: {item.available}</p>
                                <p className="text-sm text-zinc-400">Limit: {item.limit}</p>
                            </div>

                            <p className="text-sm text-zinc-400">
                                {item.paymentMethods.map((method, idx) => (
                                    <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 rounded-full mr-2 mb-1">{method}</span>
                                ))}
                            </p>
                             */}
                            {/*
                            <p className="text-lg text-green-500 cursor-pointer">
                                Buy USDT
                            </p>
                            */}
                            

                            {item.status === 'ordered' && (
                              <>

                              {acceptingSellOrder ? (
                                  <button
                                      disabled={true}
                                      className="text-lg bg-gray-200 text-gray-700 px-4 py-2 rounded-md mt-4"
                                  >
                                      Processing...
                                  </button>
                              ) : (
                                <>
                                  
                                  {item.walletAddress === address ? (
                                    <div className="flex flex-col space-y-4">
                                      My Order
                                    </div>
                                  ) : (

                                      <button
                                          disabled={!user}
                                          className="text-lg bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                                          onClick={() => {
                                              console.log('Buy USDT');

                                              // open trade detail
                                              // open modal of trade detail



                                              //openModal();


                                              acceoptSellOrder(item._id);
                                        

                                          }}
                                      >
                                          Buy USDT
                                      </button>

                                    )}

                                  </>

                                )}

                              </>

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
