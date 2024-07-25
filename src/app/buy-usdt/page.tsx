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


import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 






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

  tradeId: string;
  status: string;
  acceptedAt: string;
  paymentRequestedAt: string;

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

    const goChat = () => {
        console.log('Go Chat');
        router.push(`/chat?tradeId=12345`);
    }

    

    
    const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);

    useEffect(() => {
        fetch('/api/order/getAllSellOrdersForBuyer', {
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
        .catch((error) => {
            console.error('Error:', error);
        });
    } , []);


    
    
    //const [acceptingSellOrder, setAcceptingSellOrder] = useState(false);

    const [acceptingSellOrder, setAcceptingSellOrder] = useState([] as boolean[]);

    useEffect(() => {
        setAcceptingSellOrder (
            sellOrders.map((item, idx) => {
                return false;
            })
        );
    } , [sellOrders]);



    const acceoptSellOrder = (index: number, orderId: string) => {

        if (!user) {
            return;
        }

        setAcceptingSellOrder (
            sellOrders.map((item, idx) => {
                if (idx === index) {
                    return true;
                } else {
                    return false;
                }
            })
        );


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
        })
        .finally(() => {
            setAcceptingSellOrder (
                sellOrders.map((item, idx) => {
                    return false;
                })
            );
        } );


    }



    return (

      <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

        <div className="py-20 w-full">
  
          {/* goto home button using go back icon
          history back
          */}
  
          <div className="flex justify-start space-x-4 mb-10">
              <button onClick={() => window.history.back()} className="text-zinc-100 font-semibold underline">Go Back</button>
          </div>


          <div className="flex flex-col items-start justify-center space-y-4">

              <div className='flex flex-row items-center space-x-4'>
                  <Image
                    src="/logo-tether.png"
                    alt="USDT"
                    width={35}
                    height={35}
                    className="rounded-lg"
                  />

                  <Image
                    src="/logo-polygon.png"
                    alt="Polygon"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />

                  <div className="text-2xl font-semibold">Buy USDT</div>




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

                {/* Sell Orders: 2 EA (132 USDT), Trades: 10 EA (43 USDT) */}
                {/* trades is the status is accepted or paymentRequested */}

                <div className="flex flex-col xl:flex-row gap-2 xl:gap-5 items-start">
                  <div className="text-sm">
                    {/* dot */}
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Total: {sellOrders.length} EA ({sellOrders.reduce((acc, item) => acc + item.usdtAmount, 0)} USDT)</div>
                  {/* open orders */}

                  <div className="text-sm">
                    {/* dot */}
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Open Orders: {sellOrders.filter(item => item.status === 'ordered').length} EA</div>

                  <div className="text-sm">
                    {/* dot */}
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Trades: {sellOrders.filter(item => item.status === 'accepted' || item.status === 'paymentRequested').length} EA ({sellOrders.filter(item => item.status === 'accepted' || item.status === 'paymentRequested').reduce((acc, item) => acc + item.usdtAmount, 0)} USDT)</div>
                  
                </div>

                <div className="w-full grid gap-4 lg:grid-cols-3 justify-center">

                    {sellOrders.map((item, index) => (

                        <article
                            key={index}
                            className={` w-96 xl:w-full
                              ${item.walletAddress === address ? 'border-green-500' : 'border-gray-200'}

                              ${item.status === 'accepted' || item.status === 'paymentRequested' ? 'border-red-600' : 'border-gray-200'}

                              ${item.status === 'ordered' && (new Date().getTime() - new Date(item.createdAt).getTime() > 1000 * 60 * 60 * 24) && 'border-gray-800'}

                           
                            p-4 rounded-md border bg-black bg-opacity-50
                          `}
                        >

                          {item.status === 'ordered' && (
                            <div className="flex flex-col gpa-2 items-start justify-start">


                              <div className="flex flex-row items-center space-x-2">
                                {/* if createdAt is recent 1 hours, show new badge */}
                                {new Date().getTime() - new Date(item.createdAt).getTime() < 1000 * 60 * 60 && (
                                  <Image
                                    src="/icon-new.png"
                                    alt="New"
                                    width={28}
                                    height={28}
                                  />
                                )}
                                <p className="text-sm text-zinc-400">Order opened at {
                                    item.createdAt && new Date(item.createdAt).toLocaleString()
                                }</p>
                              </div>



                              <p className="text-sm text-zinc-400">Expires in {
                                  item.createdAt && Number((new Date(item.createdAt).getTime() + 1000 * 60 * 60 * 24 - new Date().getTime()) / 1000 / 60 / 60).toFixed(0) + ' hours'
                              }</p>
                            </div>
                          )}


                            { (item.status === 'accepted' || item.status === 'paymentRequested') && (
                              <div className="mb-4 flex flex-row items-center space-x-2">
                                <Image
                                  src="/icon-trade.png"
                                  alt="Trade"
                                  width={28}
                                  height={28}
                                />
                                <p className="text-xl font-semibold text-green-500 bg-white px-2 py-1 rounded-md">
                                  TID: {item.tradeId}
                                </p>
                              </div>
                            )}

                            {item.acceptedAt && (
                              <p className="mb-4 text-sm text-zinc-400">
                                Trade started at {new Date(item.acceptedAt).toLocaleDateString() + ' ' + new Date(item.acceptedAt).toLocaleTimeString()}
                              </p>
                            )}

                            <div className="flex flex-row items-between space-x-2">

                              <div className="flex flex-col items-start">
                                <p className="text-2xl font-semibold text-white">{item.usdtAmount} USDT</p>

                                <p className="text-xl text-zinc-400">
                                  Price: {
                                    // currency
                                  
                                    Number(item.krwAmount).toLocaleString('ko-KR', {
                                      style: 'currency',
                                      currency: 'KRW',
                                    })

                                  }
                                </p>
                              </div>

                              <div className="flex flex-col items-start">
                                <p className="text-lg font-semibold text-white">Rate: {

                                  Number(item.krwAmount / item.usdtAmount).toFixed(2)

                                }</p>
                              </div>

                            </div>

                            <div className="flex flex-col items-start">
                              Payment: Bank Transfer
                            </div>

                            {(item.status === 'accepted' || item.status === 'paymentRequested') && (
                              <>
                            
                                <p className="text-xl text-green-500 font-semibold">
                                  Buyer: {
                                    item.buyer.walletAddress === address ? 'Me' :
                                    item.buyer.nickname.substring(0, 1) + '***'
                                  }
                                </p>
                              </>
                            )}
                           

                            
                            <p className="mt-2 mb-2 flex items-center gap-2">
                              <div className="flex items-center space-x-2">Seller:</div>
                              <Image
                                  src={item.avatar || '/profile-default.png'}
                                  alt="Avatar"
                                  width={20}
                                  height={20}
                                  priority={true} // Added priority property
                                  className="rounded-full"
                                  style={{
                                      objectFit: 'cover',
                                      width: '20px',
                                      height: '20px',
                                  }}
                              />
                              <h2 className="text-lg font-semibold">
                                {item.walletAddress === address ? 'Me' : item.nickname}
                               
                              </h2>

                              <Image
                                src="/verified.png"
                                alt="Verified"
                                width={20}
                                height={20}
                                className="rounded-lg"
                              />

                              <Image
                                src="/best-seller.png"
                                alt="Verified"
                                width={20}
                                height={20}
                                className="rounded-lg"
                              />

                              

                            </p>


                            {item.status === 'ordered' && (
                              <>

                              {acceptingSellOrder[index] ? (

                                <div className="flex flex-row items-center gap-2">
                                  <Image
                                    src='/loading.png'
                                    alt='loading'
                                    width={38}
                                    height={38}
                                    className="animate-spin"
                                  />
                                  <div>Accepting...</div>
                                </div>


                              ) : (
                                <>
                                  
                                  {item.walletAddress === address ? (
                                    <div className="flex flex-col space-y-4">
                                      My Order
                                    </div>
                                  ) : (
                                    <div className="w-full flex items-center justify-center">

                                      {item.status === 'ordered' && (
                                        
                                        // check if the order is expired
                                        new Date().getTime() - new Date(item.createdAt).getTime() > 1000 * 60 * 60 * 24

                                      ) ? (
                                        
                                        <Image
                                          src="/icon-expired.png"
                                          alt="Expired"
                                          width={80}
                                          height={80}
                                        />
                                       
                                      ) : (


                                        
                                        <button
                                          disabled={!user}
                                          className="text-lg bg-green-500 text-white px-4 py-2 rounded-md mt-4"
                                          onClick={() => {
                                              console.log('Buy USDT');

                                              // open trade detail
                                              // open modal of trade detail



                                              //openModal();


                                              acceoptSellOrder(index, item._id);
                                        

                                          }}
                                        >
                                          Buy USDT
                                        </button>

                                      )}

                                    </div>



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
