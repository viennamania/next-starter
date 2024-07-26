import SendbirdApp from '@sendbird/uikit-react/App';

import {router} from 'next/navigation';

const APP_ID = "D2845744-81A3-4585-99FF-4DCABE2CA190";

const USER_ID = "sendbirdian-200720";






// /chat?tradeId=101168

export default function Chat(
    {

    //userId

    userId  
} 


) {


    ///const { tradeId } = router.query;


    ///const smartAccount = useActiveAccount();
  
    ///const address = smartAccount?.address || "";

    // get params from url

   
    console.log("userId", userId);





    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <SendbirdApp appId={APP_ID} userId={userId} />
        </div>
    );

};