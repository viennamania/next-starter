import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
	acceptSellOrder,
} from '@lib/api/order';

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";
import { idCounter } from "thirdweb/extensions/farcaster/idRegistry";


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { orderId, buyerWalletAddress, buyerNickname, buyerAvatar, buyerMobile } = body;

  console.log("orderId", orderId);
  

  const result = await acceptSellOrder({
    orderId: orderId,
    buyerWalletAddress: buyerWalletAddress,
    buyerNickname: buyerNickname,
    buyerAvatar: buyerAvatar,
    buyerMobile: buyerMobile,
  });

  ////console.log("result", result);



  const {
    mobile: mobile,
    seller: seller,
    buyer: buyer,
    tradeId: tradeId,
  } = result as UserProps;


    // send sms

    const to = mobile;


    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);



    let message = null;


    const msgBody = `[UNOVE] TID[${tradeId}] Your sell order has been accepted by ${buyer?.nickname}! You must escrow USDT to proceed with the trade in 10 minutes!
    https://next.unove.space/en/sell-usdt/${orderId}`;

    message = await client.messages.create({
      ///body: "This is the ship that made the Kessel Run in fourteen parsecs?",
      body: msgBody,
      from: "+17622254217",
      to: to,
    });

    console.log(message.sid);





 
  return NextResponse.json({

    result,
    
  });
  
}
