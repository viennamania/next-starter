import { NextResponse, type NextRequest } from "next/server";


import { client } from '../../../client';


import {
  getContract,
  //readContract,
  sendTransaction,
  sendAndConfirmTransaction,
} from "thirdweb";

import {
  polygon,
  arbitrum,
} from "thirdweb/chains";

import { getOwnedNFTs } from "thirdweb/extensions/erc721";
 

  
export async function POST(request: NextRequest) {


  const body = await request.json();
  const { lang, chain, walletAddress, erc721ContractAddress } = body;

  if (!chain || !walletAddress || !erc721ContractAddress) {
    return NextResponse.json({
      status: 400,
      error: "Please provide a chain, walletAddress, and erc721ContractAddress",
    });
  }

  const contract = getContract({
    client: client,
    address: erc721ContractAddress,
    chain: chain === "polygon" ? polygon : arbitrum,
  });


  try {
    const ownedNFTs = await getOwnedNFTs({
      contract,
      owner: walletAddress,
    });

    console.log("ownedNFTs", ownedNFTs);

    return NextResponse.json({
      status: 200,
      ownedNFTs,
    });

  } catch (error) {
    console.log("error", error + "");

    return NextResponse.json({
      status: 500,
      error: error + "",
    });
  }



}
