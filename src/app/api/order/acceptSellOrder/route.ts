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

  const { lang, chain, orderId, buyerWalletAddress, buyerNickname, buyerAvatar, buyerMobile, buyerMemo } = body;

  console.log("orderId", orderId);
  

  const result = await acceptSellOrder({
    lang: lang,
    chain: chain,
    orderId: orderId,
    buyerWalletAddress: buyerWalletAddress,
    buyerNickname: buyerNickname,
    buyerAvatar: buyerAvatar,
    buyerMobile: buyerMobile,
    buyerMemo: buyerMemo,
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

    try {

      const msgBody = `[UNOVE] TID[${tradeId}] Your sell order has been accepted by ${buyer?.nickname}! You must escrow USDT to proceed with the trade in 10 minutes!`;
      

      message = await client.messages.create({
        body: msgBody,
        from: "+17622254217",
        to: to,
      });

      console.log(message.sid);

      

      const msgBody2 = `[UNOVE] TID[${tradeId}] Check following link to proceed with the trade: https://next.unove.space/${lang}/${chain}/sell-usdt/${orderId}`;

      message = await client.messages.create({
        body: msgBody2,
        from: "+17622254217",
        to: to,
      });

      console.log(message.sid);

    } catch (e) {
      console.error('error', e);
    }




 
  return NextResponse.json({

    result,
    
  });
  
}
