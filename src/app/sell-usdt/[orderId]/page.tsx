'use client';

import type { GetStaticProps, InferGetStaticPropsType } from 'next';



import { useState, useEffect, use } from "react";



import { toast } from 'react-hot-toast';

import { client } from "../../client";

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

import Modal from '../../../components/modal';

import { useRouter }from "next//navigation";



interface SellOrder {
  _id: string;
  createdAt: string;
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

  walletAddress: string;

  seller: any;


  status: string;

  acceptedAt: string;
  paymentRequestedAt: string;
  paymentConfirmedAt: string;

  tradeId: string;

  buyer: any;

  privateSale: boolean;


  escrowTransactionHash: string;
  transactionHash: string;
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





// [orderId].tsx

//function SellUsdt(orderId: string) {


/*
export async function getStaticProps(context: any) {
    const orderId = context.params.orderId;
    return {
      props: {
        orderId,
      },
    };
}


export default function SellUsdt({ orderId }: InferGetStaticPropsType<typeof getStaticProps>) {
*/

///export default function SellUsdt() {



export default function SellUsdt({ params }: { params: { orderId: string } }) {

  const router = useRouter();
    

  const orderId = params.orderId;

  
  console.log('orderId', orderId);




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





    
    const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);


    useEffect(() => {

        if (!orderId) {
          return;
        }
        
        const fetchSellOrders = async () => {
          // api call
          const response = await fetch('/api/order/getOneSellOrder', {
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
            setSellOrders(data.result.orders);
          }
  
        };
  
        fetchSellOrders();

        // fetch sell orders every 10 seconds
        const interval = setInterval(() => {

          fetchSellOrders();
        }, 10000);
  
    }, [orderId] );





    const [isModalOpen, setModalOpen] = useState(false);

    const closeModal = () => setModalOpen(false);
    const openModal = () => setModalOpen(true);

    const goChat = () => {
        console.log('Go Chat');
        router.push(`/chat?tradeId=12345`);
    }


    const [usdtAmount, setUsdtAmount] = useState(0);

    const [defaultKrWAmount, setDefaultKrwAmount] = useState(0);

    const [krwAmount, setKrwAmount] = useState(0);

    console.log('usdtAmount', usdtAmount);



    const [rate, setRate] = useState(1385.67);




    useEffect(() => {

      if (usdtAmount === 0) {

        setDefaultKrwAmount(0);

        setKrwAmount(0);

        return;
      }
    
        
      setDefaultKrwAmount( Math.round(usdtAmount * rate) );


      setKrwAmount( Math.round(usdtAmount * rate) );

    } , [usdtAmount, rate]);



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



            fetch('/api/order/getOneSellOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  orderId: orderId,
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







    const [privateSale, setprivateSale] = useState(false);


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
          rate: rate,
          privateSale: privateSale,
        })
      });

      const data = await response.json();

      //console.log('data', data);

      if (data.result) {
        toast.success('Sell order has been created');

        setUsdtAmount(0);
        setprivateSale(false);
     


        await fetch('/api/order/getOneSellOrder', {
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




    
    return (

      <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container
        max-w-screen-lg
        mx-auto">

        <div className="py-20  ">
  
          {/* goto home button using go back icon
          history back
          */}
  
          <div className="flex justify-start space-x-4 mb-10">
              <button onClick={() => router.push('/')} className="text-zinc-100 font-semibold underline">Go Home</button>
          </div>

          {!address && (
            <div className="flex flex-col items-center space-y-4 mb-4">
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
            </div>

          )}



          <div className="flex flex-col xl:flex-row items-start justify-center space-y-4">

              <div className="w-96 flex flex-col items-start space-y-4">
              
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







                </div>


                {/* my usdt balance */}
                <div className="flex flex-col gap-2 items-start">
                  <div className="text-sm">My Balance</div>
                  <div className="text-5xl font-semibold text-white">
                    {Number(balance).toFixed(2)} <span className="text-lg">USDT</span>
                  </div>
                </div>

              </div>


                <div className="w-full grid grid-cols-1 gap-4  justify-center">

                    {sellOrders.map((item, index) => (

                        <article
                            key={index}
                            className={`bg-black p-4 rounded-md border
                              
                               ${item.walletAddress === address ? 'border-green-500' : 'border-gray-200'}

                              ${item.status === 'paymentConfirmed' ? 'bg-gray-900 border-gray-900' : ''}

                               w-96 `
                            }
                        >

                            {item.status === 'ordered' && (
                              <div className=" flex flex-col items-start justify-start gap-1">


                                <div className="flex flex-row items-center gap-2">
                                  {/* new order icon */}
                                  {
                                    (new Date(item.createdAt).getTime() - new Date().getTime()) / 1000 / 60 / 60 < 24 && (
                                      <Image
                                        src="/icon-new.png"
                                        alt="New Order"
                                        width={32}
                                        height={32}
                                      />
                                    )
                                  } 



                                  {item.privateSale ? (
                                      <Image
                                        src="/icon-private-sale.png"
                                        alt="Private Sale"
                                        width={32}
                                        height={32}
                                      />
                                  ) : (
                                      <Image
                                        src="/icon-public-sale.png"
                                        alt="Public Sale"
                                        width={32}
                                        height={32}
                                      />
                                  )}
                                  {/* Expired in 24 hours */}
                                  <p className=" text-sm text-zinc-400">
                                    Expired in {24 - Math.floor((new Date().getTime() - new Date(item.createdAt).getTime()) / 1000 / 60 / 60)} hours
                                  </p>

                                </div>

                                <p className="mb-4 text-sm text-zinc-400">
                                  Opened at {
                                    new Date(item.createdAt).toLocaleDateString() + ' ' + new Date(item.createdAt).toLocaleTimeString()
                                  }
                                </p>

                              </div>
                            )}


                            { (item.status === 'accepted' || item.status === 'paymentRequested' || item.status === 'paymentConfirmed') && (

                              <div className='flex flex-row items-center gap-2 bg-white px-2 py-1 rounded-md mb-4'>

                                {item.privateSale ? (
                                    <Image
                                      src="/icon-private-sale.png"
                                      alt="Private Sale"
                                      width={32}
                                      height={32}
                                    />
                                ) : (
                                    <Image
                                      src="/icon-public-sale.png"
                                      alt="Public Sale"
                                      width={32}
                                      height={32}
                                    />
                                )}




                                <p className=" text-xl font-semibold text-green-500 ">
                                  TID: {item.tradeId}
                                </p>
                              </div>

                            )}

                            {item.acceptedAt && (

                              <div className='flex flex-row items-center gap-2 mb-4'>
                                
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>

                                <p className="text-sm text-zinc-400">
                                  Trade started at {new Date(item.acceptedAt).toLocaleDateString() + ' ' + new Date(item.acceptedAt).toLocaleTimeString()}
                                </p>
                              </div>


                            )}

                            {item.status === 'paymentConfirmed' && (


                              <>

                                <div className='flex flex-row items-center gap-2 mb-4'>
                                  {/* dot */}
                                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>

                                  <p className="text-sm text-zinc-400">
                                    Trade ended at {new Date(item.paymentConfirmedAt).toLocaleDateString() + ' ' + new Date(item.paymentConfirmedAt).toLocaleTimeString()}
                                  </p>
                                </div>

                                <div className="flex flex-row items-center gap-2">

                                  <Image
                                    src='/timer.png'
                                    alt='timer'
                                    width={32}
                                    height={32}
                                  />

                                  <div className="text-sm text-green-500">
                                    Trading time is {

                                  ( (new Date(item.paymentConfirmedAt).getTime() - new Date(item.acceptedAt).getTime()) / 1000 / 60 ).toFixed(0) 

                                    } minutes
                                  </div>

                                </div>


                              </>

                            )}


                            <p className="mt-4 text-2xl font-bold text-white">{item.usdtAmount} USDT</p>

                            <p className="text-xl text-zinc-400"> Price: {
                              Number(item.krwAmount).toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'KRW'
                              })
                            }</p>

                            
                            <p className="text-sm text-zinc-400">Rate: 1 USDT = {

                                // currency format
                                Number((item.krwAmount / item.usdtAmount).toFixed(2)).toLocaleString('en-US', {
                                  style: 'currency',
                                  currency: 'KRW'
                                })



                              }</p>
                            


                            <div className='mt-4 flex flex-row items-center gap-2 mb-2'>



                                <Image
                                    src={item.avatar || '/profile-default.png'}
                                    alt="Avatar"
                                    width={32}
                                    height={32}
                                    priority={true} // Added priority property
                                    className="rounded-full"
                                    style={{
                                        objectFit: 'cover',
                                        width: '32px',
                                        height: '32px',
                                    }}
                                />      


                                <h2 className="text-lg font-semibold">
                                    Seller: {

                                        item.walletAddress === address ? item.nickname + ' :Me' :
                                        
                                        item.nickname

                                    }
                                </h2>

                                <Image
                                    src="/verified.png"
                                    alt="Verified"
                                    width={24}
                                    height={24}
                                />

                                <Image
                                  src='/best-seller.png'
                                  alt='Best Seller'
                                  width={24}
                                  height={24}
                                />

                            </div>

                            {/* buyer */}
                            {item.buyer && (

                              <div className='flex flex-row items-center gap-2 mb-2'>



                                <Image
                                  src={item.buyer.avatar || "/profile-default.png"}
                                  alt="Profile Image"
                                  width={32}
                                  height={32}
                                  priority={true} // Added priority property
                                  className="rounded-full"
                                  style={{
                                      objectFit: 'cover',
                                      width: '32px',
                                      height: '32px',
                                  }}
                                />

                                <h2 className="text-lg font-semibold">
                                    Buyer: {

                                        item.buyer ? item.buyer.nickname.substring(0, 1) + '***' : 'Anonymous'

                                    }
                                </h2>

                                {item.buyer && (
                                  <Image
                                    src="/verified.png"
                                    alt="Verified"
                                    width={24}
                                    height={24}
                                  />
                                )}

                              </div>

                            )}


                            {/* share button */}
                            {item.walletAddress === address && item.privateSale && (
                              <button
                                  className="text-sm bg-blue-500 text-white px-2 py-1 rounded-md"
                                  onClick={() => {
                                    
                                    router.push(`/sell-usdt/${item._id}`);

                                  }}
                              >
                                <Image
                                  src="/icon-share.png"
                                  alt="Share"
                                  width={16}
                                  height={16}
                                />
                                Share
                              </button>
                            )}



                            {/* waiting for escrow */}
                            {item.status === 'accepted' && (
                                <div className="mt-4 flex flex-row gap-2 items-center justify-start">

                                  {/* rotate loading icon */}
                                
                                  <Image
                                    src="/loading.png"
                                    alt="Escrow"
                                    width={32}
                                    height={32}
                                    className="animate-spin"
                                  />

                                  <div>Waiting for seller to deposit {item.usdtAmount} USDT to escrow...</div>

                                </div>
                            )}
                            


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



                            {/* bank transfer infomation */}
                            {item.status === 'paymentRequested' && (

                              <div className="mt-4 flex flex-col items-start gap-2">

                                {/* escrow infomation */}
                                <div className='flex flex-row items-center gap-2'>

                                  <Image
                                    src='/smart-contract.png'
                                    alt='Escrow'
                                    width={32}
                                    height={32}
                                  />

                                  <div className="text-lg font-semibold text-green-500">
                                    Escrow: {item.usdtAmount} USDT
                                  </div>

                                  {/* polygon icon to go to polygon scan */}
                                  <button
                                    className="text-sm bg-green-500 text-white px-2 py-1 rounded-md"
                                    onClick={() => {
                                      window.open(`https://polygonscan.com/tx/${item.escrowTransactionHash}`);
                                    }}
                                  >
                                    <Image
                                      src="/logo-polygon.png"
                                      alt="Polygon"
                                      width={24}
                                      height={24}
                                    />
                                  </button>


                                </div>


                                <div className='flex flex-row items-center gap-2'>
                                  <Image
                                    src='/icon-bank.png'
                                    alt='Bank'
                                    width={32}
                                    height={32}
                                  />
                                  <div className="text-lg font-semibold text-green-500">
                                    Bank Transfer
                                  </div>
                                </div>

                                {/* dot */}
                                <div className='flex flex-row items-center gap-2'>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div className="text-lg">
                                    Bank Name: {item.seller.bankInfo.bankName}
                                  </div>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div className="text-lg ">
                                    Account Number: {item.seller.bankInfo.accountNumber}
                                  </div>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div className="text-lg">
                                    Account Holder: {item.seller.bankInfo.accountHolder}
                                  </div>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div className="text-lg">
                                    Deposit Name: {item.tradeId}
                                  </div>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div className="text-lg">
                                    Deposit Amount: {
                                      item.krwAmount.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'KRW'
                                      })
                                    }
                                  </div>
                                </div>

                                <div className='flex flex-row items-center gap-2'>
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div className="text-lg">
                                    Deposit Deadline: {
                                     
                                      new Date(new Date(item.paymentRequestedAt).getTime() + 1000 * 60 * 60 * 1).toLocaleString()
                                    
                                    }
                                  </div>
                                </div>


                                {/* waiting for receive USDT */}
                                <div className="mt-4 flex flex-row gap-2 items-center justify-start">

                                  {/* rotate loading icon */}
                                
                                  <Image
                                    src="/loading.png"
                                    alt="Escrow"
                                    width={32}
                                    height={32}
                                    className="animate-spin"
                                  />

                                  <div>Waiting for seller to confirm payment...</div>

                                </div>


                              </div>
                            )}
                              

                            {item.status === 'paymentConfirmed' && (

                              <div className="w-full mt-2 mb-2 flex flex-col items-center ">
                                <Image
                                  src='/confirmed.png'
                                  alt='confirmed'
                                  width={200}
                                  height={200}
                                />



                              </div>

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


