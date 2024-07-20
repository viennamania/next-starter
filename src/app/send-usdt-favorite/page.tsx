// send USDT
'use client';


import React, { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';
import { client } from '../client';

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
} from "thirdweb";

import { balanceOf } from "thirdweb/extensions/erc20";
 



import { sendAndConfirmTransaction } from "thirdweb";

import {
  createWallet,
  inAppWallet,
} from "thirdweb/wallets";


 
import { transfer } from "thirdweb/extensions/erc20";

import Image from 'next/image';


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



export default function SendUsdt() {



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
  
      console.log(result);
  
      setBalance( Number(result) / 10 ** 6 );

    };

    if (address) getBalance();

  } , [address]);


  console.log(balance);





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
    mobile: '',
    walletAddress: '',
    createdAt: '',
    settlementAmountOfFee: '',
  });




  console.log("recipient.walletAddress", recipient.walletAddress);
  console.log("amount", amount);


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

        toast.success('USDT sent successfully');

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
      toast.error('Failed to send USDT');
    }

    setSending(false);
  };


  


  return (

    <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

      <div className="py-20 ">

        {/* goto home button using go back icon
        history back
        */}

        <div className="flex justify-start space-x-4 mb-10">
            <button onClick={() => window.history.back()} className="text-zinc-100 font-semibold">Go Back</button>
        </div>
        


        <div className="flex flex-col items-start justify-center space-y-4">

            <div className='flex flex-row items-center space-x-4'>
              <Image
                src="https://cryptologos.cc/logos/tether-usdt-logo.png"
                alt="USDT"
                width={30}
                height={30}
              />
              <div className="text-2xl font-semibold">Send USDT</div>





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

            <div className='w-full  flex flex-col gap-5 border border-gray-300 p-4 rounded-lg'>


              <div className="text-lg">Enter the amount and recipient address</div>

              <input
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

              <select
                className="w-full p-2 border border-gray-300 rounded text-black"
                value={recipient.nickname}


                onChange={(e) => {

                  const selectedUser = users.find((user) => user.nickname === e.target.value) as any;

                  console.log("selectedUser", selectedUser);

                  setRecipient(selectedUser);

                } } 

              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.nickname}>{user.nickname}</option>
                ))}
              </select>


              {/* sending rotate animation */}
              {sending && (
                <div className="
                  w-5 h-5 border-2 border-zinc-800 rounded-full animate-spin
                  border-t-2 border-t-zinc-800
                  border-b-2 border-b-zinc-800
                  border-l-2 border-l-transparent
                  border-r-2 border-r-transparent
                "></div>


              )}
              <button
                disabled={!address || !recipient.walletAddress || !amount || sending}
                onClick={sendUsdt}
                className="w-full bg-zinc-800 text-white p-2 rounded text-center font-semibold hover:bg-zinc-700 hover:text-white"
              >
                  Send
              </button>

              <div className="text-xl font-semibold">
                  Balance: {balance} USDT
              </div>

            </div>



        </div>

       </div>

    </main>

  );

}
