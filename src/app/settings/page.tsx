// nickname settings
'use client';
import React, { useEffect, useState } from 'react';



import { toast } from 'react-hot-toast';

import {
    useActiveAccount,
} from "thirdweb/react";


import Image from 'next/image';

import GearSetupIcon from "@/components/gearSetupIcon";



export default function SettingsPage() {

    const smartAccount = useActiveAccount();

    const address = smartAccount?.address || "";




    
    const [nickname, setNickname] = useState("");

    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [userCode, setUserCode] = useState("");

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
                setUserCode(data.result.id);
            }
        };

        fetchData();
    }, [address]);





    const setUserData = async () => {


        // check nickname length and alphanumeric
        if (nickname.length < 5 || nickname.length > 20) {
            toast.error('Nickname should be at least 5 characters and at most 20 characters');
            return;
        }
        
        if (!/^[a-zA-Z0-9]*$/.test(nickname)) {
            toast.error('Nickname should be alphanumeric');
            return;
        }


        const response = await fetch("/api/user/setUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                walletAddress: address,
                nickname: nickname,
            }),
        });

        const data = await response.json();

        console.log("data", data);

        toast.success('Nickname saved');
    }




    return (

        <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

            <div className="py-20 ">
        
                {/* goto home button using go back icon
                history back
                */}
        
                <div className="flex justify-start space-x-4 mb-10">
                    <button onClick={() => window.history.back()} className="text-zinc-100 font-semibold">Go Back</button>
                </div>


                <div className="flex flex-col gap-5 items-center space-y-4">


                    <div className='flex flex-row items-center space-x-4'>
                        <GearSetupIcon />
                        <div className="text-2xl font-semibold">Settings</div>
                    </div>


                    <div className='w-full  flex flex-col gap-5 '>

                        {/* My Wallet */}
                        <div className='flex flex-col xl:flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>
                                
                            <div
                                className="bg-red-800 text-sm text-zinc-100 p-2 rounded"
                            >
                                My Wallet
                            </div>

                            <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xs font-semibold">
                                {address}
                            </div>

                            <button
                                onClick={() => {
                                navigator.clipboard.writeText(address);
                                toast.success('Address copied to clipboard');
                                }}
                                className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                Copy
                            </button>

                        </div>


                        {userCode && (

                            <div className='flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-red-800 text-sm text-zinc-100 p-2 rounded">
                                    My User Code
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {userCode}
                                </div>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(userCode);
                                        toast.success('User code copied to clipboard');
                                    }}
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    Copy
                                </button>

                            </div>

                        )}

                        {nickname && (
                            <div className='flex flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div className="bg-red-800 text-sm text-zinc-100 p-2 rounded">
                                   My Nickname
                                </div>

                                <div className="p-2 bg-zinc-800 rounded text-zinc-100 text-xl font-semibold">
                                    {nickname}
                                </div>


                                <button
                                    onClick={() => {

                                        //setNicknameEdit(true);

                                        nicknameEdit ? setNicknameEdit(false) : setNicknameEdit(true);

                                    } }
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                >
                                    {nicknameEdit ? 'Cancel' : 'Edit'}
                                </button>
                                
                            </div>
                        )}


                        {nicknameEdit && (
                            <div className=' flex flex-col xl:flex-row gap-2 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                                <div
                                    className="bg-red-800 text-sm text-zinc-100 p-2 rounded"
                                >
                                    Nickname
                                </div>

                                <input
                                    className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded text-2xl font-semibold"
                                    placeholder="Enter your nickname"
                                    value={nickname}
                                    type='text'
                                    onChange={(e) => setNickname(e.target.value)}
                                />
                                <button
                                    className="p-2 bg-blue-500 text-zinc-100 rounded"
                                    onClick={() => {
                                        setUserData();
                                    }}
                                >
                                    Save
                                </button>

                            </div>
                        )}

                    </div>


                </div>

            </div>

        </main>

    );

}

          
