'use client';

import { Session, Chatbox } from "@talkjs/react";


import {

  useActiveWallet,
  
} from "thirdweb/react";




export default function Chat() {


  // get the active wallet
  const activeWallet = useActiveWallet();


  //console.log("activeWallet", activeWallet);

  console.log("activeWallet", activeWallet);


  // get wallet address

  const address = activeWallet?.getAccount()?.address;
  


  console.log('address', address);
      







  return (

    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">



        <div className="py-20 w-full">
  
          {/* goto home button using go back icon
          history back
          */}
  
          <div className="flex justify-start space-x-4 mb-10">
              <button onClick={() => window.history.back()} className="text-zinc-100 font-semibold underline">Go Back</button>
          </div>



            {true && (


                <Session
                    appId="tPgv5UF1"
                    userId="sample_user_alice"
                >


                    <Chatbox
                        conversationId="sample_conversation"
                        style={{ width: "100%", height: "800px" }}
                    />

                </Session>




            )}

        </div>

    </main>


  );
}