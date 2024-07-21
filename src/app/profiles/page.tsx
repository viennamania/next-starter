// nickname settings
'use client';
import React, { use, useEffect, useState } from 'react';



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



export default function SettingsPage() {

    // get the active wallet
    const activeWallet = useActiveWallet();



    const smartAccount = useActiveAccount();

    const address = smartAccount?.address || "";



    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
  
  
      if (smartAccount) {
  
        //const phoneNumber = await getUserPhoneNumber({ client });
        //setPhoneNumber(phoneNumber);
  
  
        getUserPhoneNumber({ client }).then((phoneNumber) => {
          setPhoneNumber(phoneNumber || "");
        });
  
  
  
      }
  
    } , [smartAccount]);




    
    const [nickname, setNickname] = useState("");
    const [avatar, setAvatar] = useState("/profile-default.png");
    const [userCode, setUserCode] = useState("");


    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [editedNickname, setEditedNickname] = useState("");


    const [avatarEdit, setAvatarEdit] = useState(false);



    const [seller, setSeller] = useState(null) as any;




    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                }),
            });

            const data = await response.json();

            console.log("data", data);

            if (data.result) {
                setNickname(data.result.nickname);
                
                data.result.avatar && setAvatar(data.result.avatar);
                

                setUserCode(data.result.id);

                setSeller(data.result.seller);
            }
        };

        fetchData();
    }, [address]);






    const setUserData = async () => {


        // check nickname length and alphanumeric
        //if (nickname.length < 5 || nickname.length > 10) {

        if (editedNickname.length < 5 || editedNickname.length > 10) {

            toast.error('Nickname should be at least 5 characters and at most 10 characters');
            return;
        }
        
        ///if (!/^[a-z0-9]*$/.test(nickname)) {
        if (!/^[a-z0-9]*$/.test(editedNickname)) {
            toast.error('Nickname should be alphanumeric and lowercase');
            return;
        }

        if (nicknameEdit) {


            const response = await fetch("/api/user/updateUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    
                    //nickname: nickname,
                    nickname: editedNickname,

                }),
            });

            const data = await response.json();

            console.log("updateUser data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                toast.success('Nickname saved');

            } else {
                toast.error('Error saving nickname');
            }


        } else {

            const response = await fetch("/api/user/setUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    walletAddress: address,
                    
                    //nickname: nickname,
                    nickname: editedNickname,

                    mobile: phoneNumber,
                }),
            });

            const data = await response.json();

            console.log("data", data);

            if (data.result) {

                setUserCode(data.result.id);
                setNickname(data.result.nickname);

                setNicknameEdit(false);
                setEditedNickname('');

                toast.success('Nickname saved');

            } else {
                toast.error('Error saving nickname');
            }
        }


        

        
    }



    const [applying, setApplying] = useState(false);


    const apply = async () => {
      if (applying) {
        return;
      }
  
  
  
      setApplying(true);


      const toWalletAddress = "0xe38A3D8786924E2c1C427a4CA5269e6C9D37BC9C";
      const amount = 1;
  
      try {
  
  
  
          // send USDT
          // Call the extension function to prepare the transaction
          const transaction = transfer({
              contract,
              to: toWalletAddress,
              amount: amount,
          });
          
  
          const transactionResult = await sendAndConfirmTransaction({
              transaction: transaction,
              
              account: smartAccount as any,
          });
  
          console.log(transactionResult);
  
          await fetch('/api/user/updateSeller', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress: address,
                sellerStatus: 'confirmed',
            }),
          });


          await fetch('/api/user/getUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress: address,
            }),
          }).then((response) => response.json())
            .then((data) => {
                setSeller(data.result.seller);
            });

  
  
  
          toast.success('USDT sent successfully');
  
        
  
  
      } catch (error) {
        toast.error('Failed to send USDT');
      }
  
      setApplying(false);
    };
  



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
                        <GearSetupIcon />
                        <div className="text-2xl font-semibold">Profile Settings</div>

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


                    <div className='w-full  flex flex-col gap-5 '>

                        {/* profile picture */}
                        
                        {/*userCode && (
                            <div className='flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-red-800 text-sm text-zinc-100 p-2 rounded">
                                    Profile Picture
                                </div>

                               
                                <Image src={avatar} width={100} height={100} alt="Profile Picture"
                                    className='rounded'
                                />
                                

                                <button
                                    disabled={!address}
                                    onClick={() => {
                                        
                                        avatarEdit ? setAvatarEdit(false) : setAvatarEdit(true);

                                    }}
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    {avatarEdit ? 'Cancel' : 'Edit'}
                                    
                                </button>

                            </div>
                        )*/}
                        

                        {userCode && (
                            <div className='flex flex-col xl:flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-red-800 text-sm text-zinc-100 p-2 rounded">
                                    My Profile Picture
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    <Uploader
                                        
                                        walletAddress={address}
                                    />
                                </div>

                            </div>
                        )}



                        {userCode && (
                            <div className='flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-red-800 text-sm text-zinc-100 p-2 rounded">
                                   My Nickname
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {nickname}
                                </div>


                                
                                <button
                                    onClick={() => {

                                       

                                        nicknameEdit ? setNicknameEdit(false) : setNicknameEdit(true);

                                    } }
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    {nicknameEdit ? 'Cancel' : 'Edit'}
                                </button>
                                
                            </div>
                        )}


                        { (nicknameEdit || !userCode) && (
                            <div className=' flex flex-col xl:flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div
                                    className="bg-red-800 text-sm text-zinc-100 p-2 rounded"
                                >
                                    Nickname
                                </div>

                                <input
                                    disabled={!address}
                                    className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-2xl font-semibold"
                                    placeholder="Enter your nickname"
                                    
                                    //value={nickname}
                                    value={editedNickname}

                                    type='text'
                                    onChange={(e) => {
                                        // check if the value is a number
                                        // check if the value is alphanumeric and lowercase

                                        if (!/^[a-z0-9]*$/.test(e.target.value)) {
                                            toast.error('Nickname should be alphanumeric and lowercase');
                                            return;
                                        }
                                        if ( e.target.value.length > 10) {
                                            toast.error('Nickname should be at least 5 characters and at most 10 characters');
                                            return;
                                        }

                                        //setNickname(e.target.value);

                                        setEditedNickname(e.target.value);

                                    } }


                                />
                                <div className='flex flex-row gap-2 items-center justify-between'>
                                    <div className="text-xs font-semibold">5-10 characters</div>
                                    <div className="text-xs font-semibold">alphanumeric lowercase</div>
                                </div>
                                <button
                                    disabled={!address}
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                    onClick={() => {
                                        setUserData();
                                    }}
                                >
                                    Save
                                </button>

                            </div>
                        )}



                        {userCode && (

                            <div className='flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-red-800 text-sm text-zinc-100 p-2 rounded">
                                    My Referral Code
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {userCode}
                                </div>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(userCode);
                                        toast.success('Referral code copied to clipboard');
                                    }}
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    Copy
                                </button>

                            </div>

                        )}



                        {userCode && seller && (
                            <div className='flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-red-800 text-sm text-zinc-100 p-2 rounded">
                                    Seller
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {seller.status}
                                </div>

                                {/* goto seller page /sell-usdt */}
                                <button
                                    onClick={() => {
                                        window.location.href = '/sell-usdt';
                                    }}
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    Sell USDT
                                </button>

                            </div>
                        )}

                        {userCode && !seller && (
                            <div className='flex flex-col gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>
                                
                                <div className='w-full flex flex-row gap-2 items-center justify-between'>

                                    <div className="bg-red-800 text-sm text-zinc-100 p-2 rounded">
                                        Seller
                                    </div>

                                    <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                        Not a seller
                                    </div>

                                    {applying ? (
                                        <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                            Applying...
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                // apply to be a seller
                                                // set seller to true
                                                // set seller to false
                                                // set seller to pending

                                                apply();

                                            }}
                                            className="p-2 bg-blue-500 text-zinc-100 rounded"
                                        >
                                            Apply
                                        </button>
                                    )}

                                </div>

                                <div className="text-xs font-semibold">
                                    To become a seller, you need to send 1 USDT to the contract address
                                </div>

                            </div>
                        )}

                    </div>


                </div>

            </div>

        </main>

    );

}

          
