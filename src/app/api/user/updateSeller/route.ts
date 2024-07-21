import { NextResponse, type NextRequest } from "next/server";

import {
	updateSellerStatus,
} from '@lib/api/user';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, sellerStatus } = body;

  console.log("walletAddress", walletAddress);
  console.log("sellerStatus", sellerStatus);

  const result = await updateSellerStatus({
    walletAddress: walletAddress,
    sellerStatus: sellerStatus,
  });


 
  return NextResponse.json({

    result,
    
  });
  
}
