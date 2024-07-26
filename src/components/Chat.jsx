import SendbirdApp from '@sendbird/uikit-react/App';

import {router} from 'next/navigation';

const APP_ID = "2D7B4CDB-932F-4082-9B09-A1153792DC8D";

const USER_ID = "sendbirdian-200720";






// /chat?tradeId=101168

const Chat = (

    // get params from url

 

) => (


    ///const smartAccount = useActiveAccount();
  
    ///const address = smartAccount?.address || "";

    // get params from url

   



    <div style={{ height: "100vh", width: "100vw" }}>
        <SendbirdApp appId={APP_ID} userId={USER_ID} />
    </div>
    
);

export default Chat;
