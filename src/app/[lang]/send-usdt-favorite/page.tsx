// send USDT
'use client';


import React, { use, useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';
import { client } from '../../client';

import {
    //ThirdwebProvider,
    ConnectButton,
  
    useConnect,
  
    useReadContract,
  
    useActiveWallet,

    useActiveAccount,
    useSendBatchTransaction,
    
} from "thirdweb/react";

import {
    polygon,
    arbitrum,
} from "thirdweb/chains";

import {
    getContract,
    //readContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 


import {
  createWallet,
  inAppWallet,
} from "thirdweb/wallets";

import Image from 'next/image';

import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../dictionaries";



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


/*
const smartWallet = new smartWallet(config);
const smartAccount = await smartWallet.connect({
  client,
  personalAccount,
});
*/

import { useRouter }from "next//navigation";
import { Select } from '@mui/material';
import { Sen } from 'next/font/google';





export default function SendUsdt({ params }: any) {


  console.log("params", params);
  
  


  const [data, setData] = useState({
    title: "",
    description: "",

    menu : {
      buy: "",
      sell: "",
      trade: "",
      chat: "",
      history: "",
      settings: "",
    },

    Go_Home: "",
    My_Balance: "",
    My_Nickname: "",
    My_Buy_Trades: "",
    My_Sell_Trades: "",
    Buy: "",
    Sell: "",
    Buy_USDT: "",
    Sell_USDT: "",
    Contact_Us: "",
    Buy_Description: "",
    Sell_Description: "",
    Send_USDT: "",
    Pay_USDT: "",
    Coming_Soon: "",
    Please_connect_your_wallet_first: "",

    USDT_sent_successfully: "",
    Failed_to_send_USDT: "",

    Go_Buy_USDT: "",
    Enter_Wallet_Address: "",
    Enter_the_amount_and_recipient_address: "",
    Select_a_user: "",
    User_wallet_address: "",
    This_address_is_not_white_listed: "",
    If_you_are_sure_please_click_the_send_button: "",

    Sending: "",

  } );

  useEffect(() => {
      async function fetchData() {
          const dictionary = await getDictionary(params.lang);
          setData(dictionary);
      }
      fetchData();
  }, [params.lang]);

  const {
    title,
    description,
    menu,
    Go_Home,
    My_Balance,
    My_Nickname,
    My_Buy_Trades,
    My_Sell_Trades,
    Buy,
    Sell,
    Buy_USDT,
    Sell_USDT,
    Contact_Us,
    Buy_Description,
    Sell_Description,
    Send_USDT,
    Pay_USDT,
    Coming_Soon,
    Please_connect_your_wallet_first,

    USDT_sent_successfully,
    Failed_to_send_USDT,

    Go_Buy_USDT,
    Enter_Wallet_Address,
    Enter_the_amount_and_recipient_address,
    Select_a_user,
    User_wallet_address,
    This_address_is_not_white_listed,
    If_you_are_sure_please_click_the_send_button,

    Sending,
  } = data;



  const router = useRouter();



  ///const [toAddress, setToAddress] = useState('');


  const [amount, setAmount] = useState(0);



  const smartAccount = useActiveAccount();



  console.log("smartAccount", smartAccount);

  



  // get the active wallet
  //const activeWallet = useActiveWallet();


  //console.log("activeWallet", activeWallet);

  //console.log("activeWallet", activeWallet);


  // get wallet address

  //const address = activeWallet?.getAccount()?.address || "";
  
  const address = smartAccount?.address || "";


  console.log('address', address);




  const [balance, setBalance] = useState(0);





  /*
  const { data: balanceData } = useReadContract({
    contract, 
    method: "function balanceOf(address account) view returns (uint256)", 

    params: [ address ], // the address to get the balance of

  });

  console.log(balanceData);

  
  useEffect(() => {

    if (balanceData) {
      setBalance(
        Number(balanceData) / 10 ** 6
      );
    }
  }, [balanceData]);
  */

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





  // get list of user wallets from api
  const [users, setUsers] = useState([
    {
      _id: '',
      id: 0,
      email: '',
      nickname: '',
      mobile: '',
      walletAddress: '',
      createdAt: '',
      settlementAmountOfFee: '',
    }
  ]);

  const [totalCountOfUsers, setTotalCountOfUsers] = useState(0);

  useEffect(() => {

    const getUsers = async () => {

      const response = await fetch('/api/user/getAllUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      ///console.log("getUsers", data);


      ///setUsers(data.result.users);
      // set users except the current user

      setUsers(data.result.users.filter((user: any) => user.walletAddress !== address));



      setTotalCountOfUsers(data.result.totalCount);

    };

    getUsers();

    /*
    [
        {
            "_id": "669b7701f33f6e09a44eb105",
            "id": 311778,
            "email": null,
            "nickname": "eva1647",
            "mobile": null,
            "walletAddress": "",
            "createdAt": "2024-07-20T08:36:17.552Z",
            "settlementAmountOfFee": "0"
        },
        {
            "_id": "669b76a0f33f6e09a44eb104",
            "id": 678776,
            "email": null,
            "nickname": "genie",
            "mobile": null,
            "walletAddress": "0xaeACC0a48DBDedD982fdfa21Da7175610CAE0f51",
            "createdAt": "2024-07-20T08:34:40.151Z",
            "settlementAmountOfFee": "0"
        }
    ]
    */

  }, [address]);


  console.log("users", users);




  const [recipient, setRecipient] = useState({
    _id: '',
    id: 0,
    email: '',
    nickname: '',
    avatar: '',
    mobile: '',
    walletAddress: '',
    createdAt: '',
    settlementAmountOfFee: '',
  });



  console.log("recipient", recipient);

  //console.log("recipient.walletAddress", recipient.walletAddress);
  //console.log("amount", amount);


  const [sending, setSending] = useState(false);


  const sendUsdt = async () => {
    if (sending) {
      return;
    }


    if (!recipient.walletAddress) {
      toast.error('Please enter a valid address');
      return;
    }

    if (!amount) {
      toast.error('Please enter a valid amount');
      return;
    }

    console.log('amount', amount, "balance", balance);

    if (Number(amount) > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setSending(true);

    try {



        // send USDT
        // Call the extension function to prepare the transaction
        const transaction = transfer({
            contract,
            to: recipient.walletAddress,
            amount: amount,
        });
        

        const transactionResult = await sendAndConfirmTransaction({
            transaction: transaction,
            
            account: smartAccount as any,
        });

        console.log(transactionResult);

        await fetch('/api/transaction/setTransfer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
            amount: amount,
            toWalletAddress: recipient.walletAddress,
          }),
        });



        toast.success(USDT_sent_successfully);

        setAmount(0); // reset amount

        // refresh balance

        // get the balance

        const result = await balanceOf({
          contract,
          address: address,
        });

        console.log(result);

        setBalance( Number(result) / 10 ** 6 );
      


    } catch (error) {
      toast.error(Failed_to_send_USDT);
    }

    setSending(false);
  };



  // get user by wallet address
  const getUserByWalletAddress = async (walletAddress: string) => {

    const response = await fetch('/api/user/getUserByWalletAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
      }),
    });

    const data = await response.json();

    console.log("getUserByWalletAddress", data);

    return data.result;

  };
  
  const [wantToReceiveWalletAddress, setWantToReceiveWalletAddress] = useState(false);


  const [isWhateListedUser, setIsWhateListedUser] = useState(false);

  
  useEffect(() => {
    // check recipient.walletAddress is in the user list
    getUserByWalletAddress(recipient?.walletAddress)
    .then((data) => {
        
        console.log("data============", data);
  
        const checkUser = data

        if (checkUser) {
          setIsWhateListedUser(true);

          setRecipient(checkUser as any);

        } else {
          setIsWhateListedUser(false);

          setRecipient({


            _id: '',
            id: 0,
            email: '',
            nickname: '',
            avatar: '',
            mobile: '',
            walletAddress: recipient?.walletAddress,
            createdAt: '',
            settlementAmountOfFee: '',

          });


        }

    });

  } , [recipient?.walletAddress]);
  



  console.log("isWhateListedUser", isWhateListedUser);
  console.log("recipient", recipient);




  return (

    <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

      <div className="py-20 ">

        {/* goto home button using go back icon
        history back
        */}
        <AppBarComponent />




        <div className="mt-4 flex justify-start space-x-4 mb-10">
            <button
              onClick={() => router.push('/' + params.lang)}
              className="text-zinc-100 font-semibold underline">
              {Go_Home}
            </button>
        </div>
        


        <div className="flex flex-col items-start justify-center space-y-4">

            <div className='flex flex-row items-center space-x-4'>

              <div className='flex flex-row items-center space-x-2'>
                <Image
                  src="/logo-tether.png"
                  alt="USDT"
                  width={35}
                  height={35}
                />
                <Image
                  src="/logo-polygon.png"
                  alt="Polygon"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>

              <div className="text-2xl font-semibold">
                {Send_USDT}
              </div>





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

              {/* goto buy usdt page */}
              <div className="text-sm font-semibold text-zinc-100 mt-2 w-full text-right">
   
                <a
                  href={'/' + params.lang + '/buy-usdt'}
                  className="text-zinc-100 underline"
                >
                  {Go_Buy_USDT}
                </a>
              </div>


            {/* my usdt balance */}
            <div className="w-full flex flex-col gap-2 items-start">
              <div className="text-sm">{My_Balance}</div>
              <div className='w-full flex flex-row items-center justify-between'>
                <div className="text-5xl font-semibold text-white">
                  {Number(balance).toFixed(2)} <span className="text-lg">USDT</span>
                </div>

                <div className="text-xs font-semibold text-white">
                  {/* check box for receiver address input box */}
                  <input
                    type="checkbox"
                    className="mr-2 w-5 h-5"
                    checked={wantToReceiveWalletAddress}
                    onChange={(e) => (
                      setWantToReceiveWalletAddress(e.target.checked),
                      setRecipient({
                        ...recipient,
                        walletAddress: '',
                      })
                    )}
                  />
                  <div className="text-xs">{Enter_Wallet_Address}</div>
                </div>
              </div>
            </div>


            <div className='w-full  flex flex-col gap-5 border border-gray-300 p-4 rounded-lg'>


              <div className="text-lg">{Enter_the_amount_and_recipient_address}</div>

              <input
                disabled={sending}
                type="number"
                //placeholder="Enter amount"
                className="w-full p-2 border border-gray-300 rounded text-black text-5xl font-semibold "
                
                value={amount}

                onChange={(e) => (

                  // check if the value is a number


                  // check if start 0, if so remove it

                  e.target.value = e.target.value.replace(/^0+/, ''),



                  // check balance

                  setAmount(e.target.value as any)

                )}
              />


            
              {/*
              <input
                  type="text"
                  placeholder="Enter address"
                  className="w-80 p-2 border border-gray-300 rounded text-black"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
              />
              */}
              {/* user list and select one */}

              {!wantToReceiveWalletAddress ? (
                <>
                <div className='flex flex-row gap-5 items-center justify-between'>
                  <select
                    disabled={sending}

                    className="
                      
                      w-full p-2 border border-gray-300 rounded text-black text-2xl font-semibold "
                      
                    value={
                      recipient?.nickname
                    }


                    onChange={(e) => {

                      const selectedUser = users.find((user) => user.nickname === e.target.value) as any;

                      console.log("selectedUser", selectedUser);

                      setRecipient(selectedUser);

                    } } 

                  >
                    <option value="">{Select_a_user}</option>
                    

                    {users.map((user) => (
                      <option key={user.id} value={user.nickname}>{user.nickname}</option>
                    ))}
                  </select>

                  {/* select user profile image */}

                  <div className=" w-48 flex flex-row gap-2 items-center justify-center">
                    <Image
                      src={recipient?.avatar || '/profile-default.png'}
                      alt="profile"
                      width={38}
                      height={38}
                      className="rounded-full"
                      style={{
                        objectFit: 'cover',
                        width: '38px',
                        height: '38px',
                      }}
                    />

                    {recipient?.walletAddress && (
                      <Image
                        src="/verified.png"
                        alt="check"
                        width={28}
                        height={28}
                      />
                    )}

                  </div>


                </div>
             

                {/* input wallet address */}
                
                <input
                  disabled={true}
                  type="text"
                  placeholder={User_wallet_address}
                  className="w-full p-2 border border-gray-300 rounded text-white text-sm xl:text-lg font-semibold"
                  value={recipient?.walletAddress}
                  onChange={(e) => {
  
                    
                    
                      getUserByWalletAddress(e.target.value)

                      .then((data) => {

                        //console.log("data", data);

                        const checkUser = data;

                        if (checkUser) {
                          setRecipient(checkUser as any);
                        } else {
                          
                          setRecipient({
                            ...recipient,
                            walletAddress: e.target.value,
                          });
                          
                        }

                      });

                  } }
                />

              </>

              ) : (

                <div className='flex flex-col gap-5 items-center justify-between'>
                  <input
                    disabled={sending}
                    type="text"
                    placeholder="Enter wallet address"
                    className="w-full p-2 border border-gray-300 rounded text-white bg-black text-sm xl:text-2xl font-semibold"
                    value={recipient.walletAddress}
                    onChange={(e) => setRecipient({
                      ...recipient,
                      walletAddress: e.target.value,
                    })}
                  />

                  {isWhateListedUser ? (
                    <div className="flex flex-row gap-2 items-center justify-center">


                      <Image
                        src={recipient.avatar || '/profile-default.png'}
                        alt="profile"
                        width={30}
                        height={30}
                        className="rounded-full"
                        style={{
                          objectFit: 'cover',
                          width: '38px',
                          height: '38px',
                        }}
                      />
                      <div className="text-white">{recipient?.nickname}</div>
                      <Image
                        src="/verified.png"
                        alt="check"
                        width={30}
                        height={30}
                      />
                      
                    </div>
                  ) : (
                    <>

                    {recipient?.walletAddress && (
                      <div className='flex flex-row gap-2 items-center justify-center'>
                        {/* dot icon */}
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>

                        <div className="text-red-500">
                          {This_address_is_not_white_listed}<br />
                          {If_you_are_sure_please_click_the_send_button}
                        </div>
                      </div>

                    )}

                    </>
                  )}



                </div>

              )} 




              <button
                disabled={!address || !recipient?.walletAddress || !amount || sending}
                onClick={sendUsdt}
                className={`mt-10 w-full p-2 rounded-lg text-xl font-semibold

                    ${
                    !address || !recipient?.walletAddress || !amount || sending
                    ?'bg-gray-300 text-gray-400'
                    : 'bg-green-500 text-white'
                    }
                   
                   `}
              >
                  {Send_USDT}
              </button>

              <div className="w-full flex flex-row gap-2 text-xl font-semibold">

                {/* sending rotate animation with white color*/}
                {sending && (
                  <div className="
                    w-6 h-6
                    border-2 border-zinc-800
                    rounded-full
                    animate-spin
                  ">
                    <Image
                      src="/loading.png"
                      alt="loading"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <div className="text-white">
                  {sending ? Sending : ''}
                </div>

              </div>

            </div>



        </div>

       </div>

    </main>

  );

}
