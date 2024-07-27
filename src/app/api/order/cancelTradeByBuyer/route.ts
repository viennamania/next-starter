import { NextResponse, type NextRequest } from "next/server";

import {
  UserProps,
	cancelTradeByBuyer,
} from '@lib/api/order';

// Download the helper library from https://www.twilio.com/docs/node/install
import twilio from "twilio";


export async function POST(request: NextRequest) {

  const body = await request.json();

  const { orderId, walletAddress: walletAddress } = body;

  //console.log("orderId", orderId);
  //console.log("walletAddress", walletAddress);
  

  const result = await cancelTradeByBuyer({
    orderId: orderId,
    walletAddress: walletAddress,
  });

  ////console.log("result", result);


  if (result) {
    /*
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  
    const message = await client.messages.create({
      body: `Your trade has been cancelled. Order Id: ${orderId}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.TWILIO_DESTINATION_PHONE_NUMBER,
    });
  
    //console.log(message.sid);
    */

    return NextResponse.json({

      result: true,
      
    });  
  } else {
 
    return NextResponse.json({

      result: false,
      
    });

  }
  
}
