// nickname settings
'use client';
import React, { use, useEffect, useState } from 'react';



import { toast } from 'react-hot-toast';

import { client } from "../../../client";


import {
    getContract,
    //readContract,
    sendTransaction,
    sendAndConfirmTransaction,
} from "thirdweb";

import { balanceOf, transfer } from "thirdweb/extensions/erc20";
 


import {
    polygon,
    arbitrum,
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
import { add } from 'thirdweb/extensions/farcaster/keyGateway';


const wallets = [
    inAppWallet({
      auth: {
        options: ["phone"],
      },
    }),
];


import { useRouter }from "next//navigation";



import AppBarComponent from "@/components/Appbar/AppBar";
import { getDictionary } from "../../../dictionaries";



import axios from 'axios';



const contractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT on Polygon
const contractAddressArbitrum = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"; // USDT on Arbitrum





export default function SettingsPage({ params }: any) {


    console.log("SettingsPage params", params);
    
    
    
    
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

        Wallet_Settings: "",
        Profile_Settings: "",


        My_Wallet_Address: "",
        My_Phone_Number: "",
    
        Wallet_Address_Description1: "",
        Wallet_Address_Description2: "",
    
        I_understand_that_I_should_never_deposit_any_other_tokens: "",

        Copy: "",

        Disconnect_Wallet: "",
    

    
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

        Wallet_Settings,
        Profile_Settings,

        My_Wallet_Address,
        My_Phone_Number,

        Wallet_Address_Description1,
        Wallet_Address_Description2,

        I_understand_that_I_should_never_deposit_any_other_tokens,

        Copy,

        Disconnect_Wallet,

    } = data;
    
    
    






    const router = useRouter();

    // get the active wallet
    const activeWallet = useActiveWallet();



    const smartAccount = useActiveAccount();

    const address = smartAccount?.address || "";



    const contract = getContract({
        // the client you have created via `createThirdwebClient()`
        client,
        // the chain the contract is deployed on
        
        
        chain: params.chain === "arbitrum" ? arbitrum : polygon,
      
      
      
        // the contract's address
        ///address: contractAddress,
    
        address: params.chain === "arbitrum" ? contractAddressArbitrum : contractAddress,
    
    
        // OPTIONAL: the contract's abi
        //abi: [...],
      });
    




    const [balance, setBalance] = useState(0);

    useEffect(() => {
  
      if (!address) return;
      // get the balance
  
  
      if (!contract) {
        return;
      }
  
      const getBalance = async () => {
  
        try {
          const result = await balanceOf({
            contract,
            address: address,
          });
      
          //console.log(result);
      
          setBalance( Number(result) / 10 ** 6 );
  
        } catch (error) {
          console.error("Error getting balance", error);
        }
  
      };
  
      if (address) getBalance();
  
      // get the balance in the interval
  
      const interval = setInterval(() => {
        if (address) getBalance();
      }, 1000);
  
  
      return () => clearInterval(interval);
  
    } , [address, contract]);



    

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


    const [nicknameEdit, setNicknameEdit] = useState(false);

    const [editedNickname, setEditedNickname] = useState("");


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

            const response = await fetch("/api/user/setUserVerified", {
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


    console.log("nickname", nickname);
    console.log("userCode", userCode);


    const [agreementCopy, setAgreementCopy] = useState(false);





    const [prompt, setPrompt] = useState("");
    const [number, setNumber] = useState(1);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
  
  
    // check if prompt is real picture
    // 真实图片
    const [checkIsRealPicture, setCheckIsRealPicture] = useState(false);
  
  
  
    function getImages() {
  
  
      //console.log("prompt=", prompt);
  
      //if (token != "" && prompt != "") {
  
      if (prompt != "") {
  
  
  
        setError(false);
        setLoading(true);

        /*
        axios
          
          ////.post(`/api/images?t=${token}&p=${prompt}&n=${number}`)
  
          .post(`/api/ai/images?p=${prompt}&n=${number}&userid=${address}&real=${checkIsRealPicture}`)
  
  
          .then((res) => {
  
            //console.log("res=", res);
  
            setResults(res.data.result);
            setLoading(false);
          })
          .catch((err) => {
  
            setLoading(false);
            setError(true);
  
            
            console.log("err=", err);
  
   
  
          });
        */

        async function fetchData() {

            const response = await fetch("/api/ai/images?p=" + prompt + "&n=" + number + "&userid=" + address + "&real=" + checkIsRealPicture, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            });

            const data = await response.json();

            console.log("data", data);

            setResults(data.result);

            setLoading(false);

        }

        fetchData();

  
  
      } else {
        
        setError(true);
  
      }
    }
  
    //const [type, setType] = useState("webp");
    const [type, setType] = useState("png");
  


    console.log("results", results);


    const [myImages, setMyImages] = useState([]);
    // loading my images
    const [loadingMyImages, setLoadingMyImages] = useState(false);


    useEffect(() => {
        async function fetchData() {
            
            setLoadingMyImages(true);

            const response = await fetch("/api/ai/getImages?userid=" + address, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            //console.log("getImages data", data);

            setMyImages(data.images || []);

            setLoadingMyImages(false);
        }

        fetchData();
    }, [address]);



    const [loadingDownload, setLoadingDownload] = useState(false);

    //function download(url: string) {

    // aync function download(url: string) {

    const download = async (url: string) => {
  
      setLoadingDownload(true);


      // /api/download`

        const response = await fetch("/api/ai/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                url: url,
                type: type,
                userid: address,
            }),
        });

        /*
        if (!response.ok) {
            console.log("error", response);

            toast.success('Already downloaded');

            setLoadingDownload(false);
            return;
        }
        */

        const data = await response.json();

        if (data.error) {
            console.log("error", data.error);

            toast.error(data.error);

            setLoadingDownload(false);
            return;
        }




        //console.log("data", data);

        const link = document.createElement("a");

        link.href = data.result;

        link.download = `${prompt}.${type.toLowerCase()}`;

        link.click();
        

        toast.success('Downloaded');

        // get my images from api
        const response2 = await fetch("/api/ai/getImages?userid=" + address, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data2 = await response2.json();

        console.log("data2", data2);

        setMyImages(data2.images || []);

        setLoadingDownload(false);
  
    }


    // mint nft
    const [loadingMintNFT, setLoadingMintNFT] = useState(false);

    const mintNFT = async (url: string) => {

        setLoadingMintNFT(true);

        /*
        const response = await fetch("/api/ai/mintNFT", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                url: url,
                userid: address,
            }),
        });

        const data = await response.json();

        console.log("data", data);

        if (data.result) {
            toast.success('NFT minted');
        } else {
            toast.error('Error minting NFT');
        }
        */

        toast.success('NFT minted');

        setLoadingMintNFT(false);

    }


    return (

        <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

            <div className="py-0 w-full">
        
                {/* goto home button using go back icon
                history back
                */}

                <AppBarComponent />
        
                
                <div className="mt-4 flex justify-start space-x-4 mb-10">
                    <button
                        onClick={() => router.push(

                        '/' + params.lang + '/' + params.chain
                        
                    )}
                        className="text-zinc-100 font-semibold underline"
                    >
                        {Go_Home}
                    </button>
                </div>
                


                <div className="flex flex-col items-start justify-center space-y-4">

                    <div className='flex flex-row items-center space-x-4'>
                        <Image
                            src="/logo-chatgpt.png"
                            alt="ChatGPT"
                            width={40}
                            height={40}
                            className='bg-zinc-100 p-2 rounded'
                        />
                        <div className="text-2xl font-semibold">
                            ChatGPT
                        </div>
                        {/* balance */}
                        {address && (
                            <div className="text-5xl font-semibold text-white">
                                {Number(balance).toFixed(2)} <span className="text-lg">USDT</span>
                            </div>
                        )}

                        {!address && (

                            <>
                                {params.chain === "polygon" && (

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




                                {params.chain === "arbitrum" && (

                                    <ConnectButton

                                        client={client}

                                        wallets={wallets}
                                        
                                        accountAbstraction={{        
                                        
                                        chain: arbitrum,

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



                                </>

                            )}

                    </div>


                    <div className='w-full  flex flex-col gap-5 '>


                        {/* input prompt */}
                        <div className='flex flex-col xl:flex-row gap-5 items-center justify-between border border-gray-300 p-4 rounded-lg'>

                            <div className='flex flex-row items-center gap-2'>
                                {/*
                                <input
                                    disabled={!address || loading}
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="prompt"
                                    className={` ${!address || loading ? 'bg-gray-300 text-gray-500' : 'bg-zinc-100 text-zinc-800'} p-2 rounded
                                        text-lg w-full
                                        `}
                                />
                                */}
                                {/* text area for prompt */}
                                <textarea
                                    disabled={!address || loading}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="prompt"
                                    className={` ${!address || loading ? 'bg-gray-300 text-gray-500' : 'bg-zinc-100 text-zinc-800'} p-2 rounded
                                        text-lg w-full
                                        `}
                                />


                                {/* cehck box for real picture */}
                                <input
                                    type="checkbox"
                                    checked={checkIsRealPicture}
                                    onChange={(e) => setCheckIsRealPicture(e.target.checked)}
                                    className='p-2'
                                />
                                <div>
                                    Real
                                </div>


                                <button
                                    disabled={!address || !prompt || loading}
                                    onClick={getImages}
                                    className={` ${!address || !prompt || loading ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                        text-lg font-semibold w-32
                                        `}
                                >
                                    Get
                                </button>
                                {/* Reset Button */}
                                <button
                                    disabled={!address || loading}
                                    onClick={() => {
                                        setPrompt("");
                                        setResults([]);
                                        setCheckIsRealPicture(false);
                                    }}
                                    className={` ${!address || loading ? 'bg-gray-300 text-gray-500' : 'bg-red-500 text-zinc-100'} p-2 rounded
                                        text-lg font-semibold w-32
                                        `}
                                >
                                    Reset
                                </button>


                            </div>

                            

                            <div className='mt-10 xl:mt-0 flex flex-row items-center gap-2'>
                            
                                { loading && (
                                    <Image
                                        src="/chatbot-loading.gif"
                                        alt="loading"
                                        width={400}
                                        height={400}

                                    />
                                )}

                                {!loading && results.length > 0 && results?.map((result : any, index : number) => (

                                    <div key={index} className='flex flex-col gap-2 items-center justify-between '>
                                        
                                        <div className='flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-4'>
                                            
                                            <div className='flex flex-row items-center gap-2'>
                                                <Image
                                                    src={result.url}
                                                    alt={result.url}
                                                    width={400}
                                                    height={400}
                                                    className='rounded-lg'
                                                />
                                            </div>

                                            {/* download button */}
                                            <button
                                                disabled={loadingDownload}
                                                onClick={() => download(result.url)}
                                                className={` ${loadingDownload ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                                    text-lg font-semibold m-2
                                                    `}
                                            >
                                                {loadingDownload ? 'Downloading...' : 'Download'}
                                            </button>

                                        </div>


                                    </div>
                                ))}

                            </div>

                       

                        </div>


                        {/* my images */}

                        <div className='flex flex-col gap-5 items-center justify-center'>

                            {loadingMyImages && (

                                <div className='flex flex-col items-center justify-center'>
                                    <Image
                                        src="/chatbot-loading.gif"
                                        alt="loading"
                                        width={400}
                                        height={400}

                                    />
                                </div>

                            )}

                            {!loadingMyImages && myImages.length > 0 && myImages?.map((result : any, index : number) => (

                                <div key={index} className='flex flex-col gap-2 items-center justify-between '>
                                    
                                    <div className='flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-4'>
                                        
                                        <div className='flex flex-row items-center gap-2'>
                                            <Image
                                                src={result.image}
                                                alt={result.image}
                                                width={400}
                                                height={400}
                                                className='rounded-lg'
                                            />
                                        </div>

                                        {/* mint nft button */}
                                        <button
                                            disabled={loadingMintNFT}
                                            onClick={() => mintNFT(result.image)}
                                            className={` ${loadingMintNFT ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-zinc-100'} p-2 rounded
                                                text-lg font-semibold m-2
                                                `}
                                        >
                                            {loadingMintNFT ? 'Minting NFT...' : 'Mint NFT'}
                                        </button>
                                            


                                    </div>
                                </div>

                            ))}

                        </div>




                    </div>


                </div>

            </div>

        </main>

    );

}

          
