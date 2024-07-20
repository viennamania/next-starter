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

                    <div className=' flex flex-col xl:flex-row gap-2 items-center justify-center border border-zinc-800 p-4 rounded-lg'>

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
                            className="p-2 bg-zinc-800 rounded text-zinc-100 font-semibold"
                            onClick={() => {
                                toast.success('Nickname saved');
                            }}
                        >
                            Save
                        </button>

                    </div>


                </div>

            </div>

        </main>

    );

}

          
