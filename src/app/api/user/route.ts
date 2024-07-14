import { NextResponse, type NextRequest } from "next/server";

import {
	getAllUsersForSettlement,
} from '@lib/api/user';



export async function GET(request: NextRequest) {




 
  return NextResponse.json({
    message: "Hello World",
  });
  
}
