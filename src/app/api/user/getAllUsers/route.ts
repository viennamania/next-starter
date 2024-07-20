import { NextResponse, type NextRequest } from "next/server";

import {
	getAllUsers,
} from '@lib/api/user';
import { get } from "http";



export async function POST(request: NextRequest) {

  const body = await request.json();

  //const { walletAddress } = body;


  //console.log("walletAddress", walletAddress);


  const result = await getAllUsers({
    limit: 10,
    page: 1,
  });

 
  return NextResponse.json({

    result,
    
  });
  
}
