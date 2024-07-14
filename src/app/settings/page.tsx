// nickname settings
'use client';
import React, { useEffect, useState } from 'react';



import { toast } from 'react-hot-toast';

import {
    useActiveAccount,
} from "thirdweb/react";




export default function SettingsPage() {

    const smartAccount = useActiveAccount();

    const address = smartAccount?.address || "";

    const [nickname, setNickname] = useState("");


    return (

        <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
    
            <div className="py-20">
    
                <div className="flex justify-center space-x-4 mb-10">
                    <a href="/" className="text-zinc-100 font-semibold">Home</a>
                    <a href="/buy-usdt" className="text-zinc-100 font-semibold">Buy</a>
                    <a href="/sell-usdt" className="text-zinc-100 font-semibold">Sell</a>
                    <a href="/" className="text-zinc-100 font-semibold">Wallet</a>
                    <div className="text-zinc-100 font-semibold">Settings</div>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-4xl font-bold text-zinc-100">Settings</h1>
                    <p className="text-lg text-zinc-100">Nickname</p>
                    <input
                        className="p-2 w-64 text-zinc-100 bg-zinc-800 rounded"
                        placeholder="Enter your nickname"
                        value={nickname}
                    />
                    <button className="p-2 bg-zinc-800 rounded text-zinc-100 font-semibold">Save</button>
                </div>

            </div>

        </main>

    );

}

          
