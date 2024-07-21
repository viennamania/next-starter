import { NextResponse, type NextRequest } from "next/server";

import {
	getSellOrders,
} from '@lib/api/order';



export async function POST(request: NextRequest) {

  const body = await request.json();



  const result = await getSellOrders({
    limit: 10,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
