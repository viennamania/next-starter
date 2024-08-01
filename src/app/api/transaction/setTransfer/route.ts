import { NextResponse, type NextRequest } from "next/server";

import {
	insertOne,
} from '@lib/api/transaction';


// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, amount, toWalletAddress } = body;

  console.log("walletAddress", walletAddress);
  console.log("amount", amount);
  console.log("toWalletAddress", toWalletAddress);

  const result = await insertOne({
    walletAddress: walletAddress,
    amount: amount,
    toWalletAddress: toWalletAddress,
  });

  console.log("result", result);


  
  if (result) {

      // send sms to user mobile number


      // send sms

      const to = result.toMobileNumber;
      const fromUserNickname = result.fromUserNickname;



      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(accountSid, authToken);



      let message = null;


      try {
        const body = `[UNOVE] You have received ${amount} USDT from ${fromUserNickname}!`;

        message = await client.messages.create({
          ///body: "This is the ship that made the Kessel Run in fourteen parsecs?",
          body: body,
          from: "+17622254217",
          to: to,
        });

        console.log(message.sid);

      } catch (e) {
        console.error('Error sending SMS', e);
      }

  }


 
  return NextResponse.json({

    result,
    
  });
  
}
