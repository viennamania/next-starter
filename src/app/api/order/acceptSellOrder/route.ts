import { NextResponse, type NextRequest } from "next/server";

import {
	acceptSellOrder,
} from '@lib/api/order';



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


 
  return NextResponse.json({

    result,
    
  });
  
}
