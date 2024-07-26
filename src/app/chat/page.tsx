'use client';

import { Session, Chatbox } from "@talkjs/react";


import dynamic from "next/dynamic";

import '@sendbird/uikit-react/dist/index.css';

import {

  useActiveWallet,
  
} from "thirdweb/react";




// parameters for dynamic import
// userId parameter is required

/*
const DynamicAppWithNoSSR = dynamic(() => import("../../components/Chat"), {
  ssr: false,
  loading: () => <p>...</p>
});
*/

/*
const DynamicAppWithNoSSR = dynamic(() => import("../../components/Chat"), {

  ssr: false,

  loading: (

  ) => <p>...</p>

});
*/

import Chat from "../../components/Chat";



export default function ChatPage() {


  // get the active wallet
  const activeWallet = useActiveWallet();


  //console.log("activeWallet", activeWallet);

  console.log("activeWallet", activeWallet);


  // get wallet address

  const address = activeWallet?.getAccount()?.address;
  


  console.log('address', address);
      







  return (

    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center mx-auto">



        <div className="py-20 w-full">
  
          {/* goto home button using go back icon
          history back
          */}
  
          <div className="flex justify-start space-x-4 mb-10">
              <button onClick={() => window.history.back()} className="text-zinc-100 font-semibold underline">Go Back</button>
          </div>


          {/*
          <DynamicAppWithNoSSR
          />
          */}

          {address && (
            <Chat
              userId={  address }
            />
          )}





            {/*true && (


                <Session
                    appId="tPgv5UF1"
                    userId="sample_user_alice"
                >


                    <Chatbox
                        conversationId="sample_conversation"
                        style={{ width: "100%", height: "800px" }}
                    />

                </Session>




            )*/}

        </div>

    </main>


  );
}