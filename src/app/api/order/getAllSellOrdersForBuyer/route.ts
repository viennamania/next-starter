import { NextResponse, type NextRequest } from "next/server";

import {
	getSellOrdersForBuyer,
} from '@lib/api/order';



export async function POST(request: NextRequest) {

  const body = await request.json();



  const result = await getSellOrdersForBuyer({
    limit: 100,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
