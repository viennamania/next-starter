'use client';

import { useState, useEffect, use } from "react";

import Image from "next/image";

import thirdwebIcon from "@public/thirdweb.svg";


import { client } from "./client";

//import { createThirdwebClient } from "thirdweb";

import {
  //ThirdwebProvider,
  ConnectButton,

  useConnect,

  useReadContract,

  useActiveWallet,

  useActiveAccount,

  
  
} from "thirdweb/react";

import { inAppWallet } from "thirdweb/wallets";

import {
  polygon,
  arbitrum,
} from "thirdweb/chains";


import {
  getContract,
  //readContract,
} from "thirdweb";


import { getUserPhoneNumber } from "thirdweb/wallets/in-app";


import { toast } from 'react-hot-toast';

import { useRouter }from "next//navigation";
import { add } from "thirdweb/extensions/farcaster/keyGateway";


import { getOwnedNFTs } from "thirdweb/extensions/erc721";


import GearSetupIcon from "@/components/gearSetupIcon";

/*
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || "",
});
*/





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
const editionDropAddress = "0x41FBA0bd9f4DC9a968a10aEBb792af6A09969F60";




 // get a contract
 const contractEditorDrop = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: polygon,
  // the contract's address
  address: editionDropAddress,
  // OPTIONAL: the contract's abi
  //abi: [...],
})



console.log("contractEditorDrop", contractEditorDrop);
*/




export default function Home() {



  //const { connect, isConnecting, error } = useConnect();

  ///console.log(isConnecting, error);



  const router = useRouter();

  





  // get the active wallet
  const activeWallet = useActiveWallet();



  // get wallet address

  //const address = activeWallet?.getAccount()?.address || "";
  

  const smartAccount = useActiveAccount();

  const address = smartAccount?.address || "";


  console.log('address', address);




  const [balance, setBalance] = useState(0);



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


  console.log(balance);






      

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

 

  console.log(phoneNumber);




  /*
  useEffect(() => {

    if (address) {

      try {
        getOwnedNFTs({
          contract: contractEditorDrop,
          owner: address,
        }).then((ownedNFTs) => {

          console.log("ownedNFTs=", ownedNFTs);

        });
      } catch (error) {
        console.error(error);
      }

    }

  } , [address]);
  */
  

  const [nickname, setNickname] = useState("");
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

          //console.log("data", data);

          if (data.result) {
              setNickname(data.result.nickname);
              setUserCode(data.result.id);
          }
      };

      fetchData();

  }, [address]);


  


  return (



    <main className="p-4 pb-10 min-h-[100vh] flex items-start justify-center container max-w-screen-lg mx-auto">

      <div className="py-20">
        
        {/*
        <Header />
        */}




        <div className="flex flex-col justify-center gap-5 mb-10">
          {/*
          <ConnectButton
            client={client}
            appMetadata={{
              name: "Next App",
              url: "https://next.unove.space",
            }}
          />
          */}

          {/*
          <button
            onClick={() =>
              connect(async () => {

                
                const metamask = createWallet("io.metamask"); // pass the wallet id
      
                // if user has metamask installed, connect to it
                if (injectedProvider("io.metamask")) {
                  await metamask.connect({ client });
                }
      
                // open wallet connect modal so user can scan the QR code and connect
                else {
                  await metamask.connect({
                    client,
                    walletConnect: { showQrModal: true },
                  });
                }
      
                // return the wallet
                return metamask;


              })
            }
          >
            Connect
          </button>
          */}


        
            
              
              <div className="bg-zinc-800 p-5 rounded-lg text-center">


                <div className="flex flex-row justify-between items-start">
                  {/* Tether USDT logo */}
                  <Image
                    src="https://cryptologos.cc/logos/tether-usdt-logo.png"
                    alt="USDT"
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                  {/* Settings Button */}
                  <button

                    onClick={() => {

                      if (!address) {
                        toast.error('Please connect your wallet first');
                        return;
                      }
                      // setup USDT
                      console.log("settings");

                      // redirect to settings page
                      router.push("/settings");

                    }}
                    className="text-blue-500 hover:underline"
                  >
                    <GearSetupIcon />

                  </button>

                </div>


                <h2 className="text-3xl font-semibold text-zinc-100">
                  {balance} USDT
                </h2>
                <p className="text-zinc-300">My Balance</p>


                {/* my address and copy button */}
                {/*
                <div className="flex flex-row justify-center items-center mt-4">

                  {address && (
                    <>
                      <p className="text-zinc-300 text-xs w-80">
                        {address}
                      </p>

                      <button

                        onClick={() => {
                          navigator.clipboard.writeText(address);
                          toast.success('Address copied to clipboard');
                        }}
                        className="text-sm text-blue-500 ml-2 hover:underline"
                      >
                        Copy
                      </button>
                    </>
                  )}

                </div>
                */}


                {/* send button */}

                <button
                  disabled={!address}
                  onClick={() => {
                    // send USDT
                    console.log("send USDT");

                    // redirect to send USDT page
                    router.push("/send-usdt-favorite");

                  }}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Send USDT
                </button>


              </div>

              {/* My Nickname */}
              <div className="bg-zinc-800 p-5 rounded-lg text-center">

                <h2 className="text-3xl font-semibold text-zinc-100">
                  {nickname}
                </h2>
                <p className="text-zinc-300">My Nickname</p>

              </div>
           
 

          {!address && (
            <ConnectButton

              client={client}

              // Connect Wallet button text change
              


              // inAppWallet

              //wallets={wallets}

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
                
                //title: "Connect",



              }}


              
              appMetadata={
                {
                  logoUrl: "https://next.unove.space/logo.png",
                  name: "Next App",
                  url: "https://next.unove.space",
                  description: "This is a Next App.",

                }
              }

              // custom

              
            />

          )}


        </div>


        




        {/*}
        {address && (
          <div className="flex flex-row justify-center mb-10 gap-10">

            <div className="flex flex-col items-center mr-4">
              <h3 className="text-sm font-semibold text-zinc-100">My Phone Number</h3>
              <p className="text-zinc-300 text-2xl">{phoneNumber}</p>
            </div>

            <div className="flex justify-center">
                <button
                  onClick={() => {
                    // disconnect wallet


                    activeWallet?.disconnect();

                    
                    
                    window.location.reload();

                  }}
                  className="text-sm bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  Disconnect
                </button>
            </div>
          </div>
          
        )}
        */}


        {/*
        <ThirdwebResources />
        */}

     

        <MarketResources />

      </div>
    </main>
  );
}



function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      {/*
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      
      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block -skew-x-6 text-blue-500"> Next.js </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
      */}
    </header>
  );
}

function ThirdwebResources() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 justify-center">
      <ArticleCard
        title="thirdweb SDK Docs"
        href="https://portal.thirdweb.com/typescript/v5"
        description="thirdweb TypeScript SDK documentation"
      />

      <ArticleCard
        title="Components and Hooks"
        href="https://portal.thirdweb.com/typescript/v5/react"
        description="Learn about the thirdweb React components and hooks in thirdweb SDK"
      />

      <ArticleCard
        title="thirdweb Dashboard"
        href="https://thirdweb.com/dashboard"
        description="Deploy, configure, and manage your smart contracts from the dashboard."
      />
    </div>
  );
}


function MarketResources() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 justify-center">

      <ArticleCard
        title="Buy USDT"
        href="/buy-usdt"
        description="Buy USDT with your favorite real-world currency"
      />

      <ArticleCard
        title="Sell USDT"
        href="/"
        description="Sell USDT for your favorite real-world currency"
      />

      <ArticleCard
        title="How to use USDT"
        href="/"
        description="Learn how to use USDT in your favorite DeFi apps"
      />

    </div>
  );
}





function ArticleCard(props: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <a
      
      //href={props.href + "?utm_source=next-template"}
      href={props.href}

      //target="_blank"

      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
    >
      <article>
        <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
        <p className="text-sm text-zinc-400">{props.description}</p>
      </article>
    </a>
  );
}
