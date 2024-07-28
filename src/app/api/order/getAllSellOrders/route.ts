import { NextResponse, type NextRequest } from "next/server";

import {
	getSellOrders,
} from '@lib/api/order';



export async function POST(request: NextRequest) {

  const body = await request.json();

  const { walletAddress, searchMyOrders } = body;



  const result = await getSellOrders({
    limit: 100,
    page: 1,
    walletAddress,
    searchMyOrders,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
