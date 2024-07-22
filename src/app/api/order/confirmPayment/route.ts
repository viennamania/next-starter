import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
	confirmPayment,
} from '@lib/api/order';

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { orderId } = body;

  console.log("orderId", orderId);
  

  const result = await confirmPayment({
    orderId: orderId,
  });


  //console.log("result", JSON.stringify(result));

  const {
    nickname: nickname,
    mobile: mobile,
    seller: seller,
    buyer: buyer,
    tradeId: tradeId,
    usdtAmount: usdtAmount,
    krwAmount: krwAmount,
  } = result as UserProps;



  const amount = usdtAmount;


    // send sms

    const to = buyer.mobile;


    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);



    let message = null;


    const msgBody = `[UNOVE] You received ${amount} USDT from ${nickname}. TID: ${tradeId}.`;

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
