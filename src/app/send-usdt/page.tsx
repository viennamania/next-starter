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
  smartWallet,
} from "thirdweb/wallets";
 
import { transfer } from "thirdweb/extensions/erc20";

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



  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');



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

    getBalance();

  } , [address]);


  console.log(balance);



  const [sending, setSending] = useState(false);


  const sendUsdt = async () => {
    if (sending) {
      return;
    }


    if (!toAddress) {
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
            to: toAddress,
            amount: amount,
        });
        

        const transactionResult = await sendAndConfirmTransaction({
            transaction: transaction,
            
            account: smartAccount as any,
        });

        toast.success('USDT sent successfully');

        setAmount('');

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

    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">

      <div className="py-20">

        <div className="flex justify-center space-x-4 mb-10">
          <a href="/" className="text-zinc-100 font-semibold">Home</a>
          <a href="/buy-usdt" className="text-zinc-100 font-semibold">Buy</a>
          <a href="/sell-usdt" className="text-zinc-100 font-semibold">Sell</a>
          <a href="/" className="text-zinc-100 font-semibold">Wallet</a>
          <a href="/" className="text-zinc-100 font-semibold">Settings</a>
        </div>

        <div className="flex flex-col items-center space-y-4">
            <div className="text-2xl font-semibold">Send USDT</div>
            <div className="text-lg">Enter the amount and recipient address</div>

            <input
              type="text"
              placeholder="Enter amount"
              className="w-80 p-2 border border-gray-300 rounded text-black"
              value={amount}
              onChange={(e) => (

                // check if the value is a number



                // check balance

                setAmount(e.target.value)

              )}
            />

            <input
                type="text"
                placeholder="Enter address"
                className="w-80 p-2 border border-gray-300 rounded text-black"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
            />

            {sending && (
              <div className="text-lg font-semibold text-gray-400">Sending...</div>
            )}
            <button
              disabled={sending}
              onClick={sendUsdt}
              className="bg-zinc-800 text-white p-2 rounded w-80 text-center font-semibold hover:bg-zinc-700 hover:text-white"
            >
                Send
            </button>

            <div className="text-xl font-semibold">
                Balance: {balance} USDT
            </div>
        </div>

       </div>

    </main>

  );

}
