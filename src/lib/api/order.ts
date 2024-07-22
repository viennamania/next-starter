import clientPromise from '../mongodb';

// object id
import { ObjectId } from 'mongodb';


export interface UserProps {
  /*
  name: string;
  username: string;
  email: string;
  image: string;
  bio: string;
  bioMdx: MDXRemoteSerializeResult<Record<string, unknown>>;
  followers: number;
  verified: boolean;
  */

  id: string,
  name: string,
  nickname: string,
  email: string,
  avatar: string,
  regType: string,
  mobile: string,
  gender: string,
  weight: number,
  height: number,
  birthDate: string,
  purpose: string,
  marketingAgree: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
  loginedAt: string,
  followers : number,
  emailVerified: boolean,
  bio: string,

  password: string,

  seller: any,

  status: string,

  tradeId: string,

  usdtAmount: number,
  krwAmount: number,
  
  acceptedAt: string,
  paymentRequestedAt: string,

  buyer: any,
}

export interface ResultProps {
  totalCount: number;
  orders: UserProps[];
}


export async function insertSellOrder(data: any) {

  console.log('insertSellOrder data: ' + JSON.stringify(data));

  if (!data.walletAddress || !data.usdtAmount || !data.krwAmount || !data.rate) {
    return null;
  }



  const client = await clientPromise;



  // get user mobile number by wallet address

  const userCollection = client.db('vienna').collection('users');


  const user = await userCollection.findOne<UserProps>(
    { walletAddress: data.walletAddress },
    { projection: { _id: 0, emailVerified: 0 } }
  );

  if (!user) {
    return null;
  }



  ////console.log('user: ' + user);

  const nickname = user.nickname;

  const mobile = user.mobile;

  const avatar = user.avatar;

  const seller = user.seller;



  const collection = client.db('vienna').collection('orders');

 
  const result = await collection.insertOne(

    {
      walletAddress: data.walletAddress,
      nickname: nickname,
      mobile: mobile,
      avatar: avatar,
      seller: seller,
      usdtAmount: data.usdtAmount,
      krwAmount: data.krwAmount,
      rate: data.rate,
      createdAt: new Date().toISOString(),
      status: 'ordered',
    }
  );


  if (result) {
    return {
      walletAddress: data.walletAddress,
      
    };
  } else {
    return null;
  }
  

}




// get sell orders order by createdAt desc
export async function getSellOrders(

  {

    limit,
    page,
  }: {

    limit: number;
    page: number;
  
  }

): Promise<ResultProps> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('orders');


  // status is not 'paymentConfirmed'


  const results = await collection.find<UserProps>(
    {
      //status: 'ordered',

      status: { $ne: 'paymentConfirmed' },
    },
    
    //{ projection: { _id: 0, emailVerified: 0 } }

  ).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit).toArray();

  return {
    totalCount: results.length,
    orders: results,
  };

}




// get sell orders by wallet address order by createdAt desc
export async function getSellOrdersByWalletAddress(

  {
    walletAddress,
    limit,
    page,
  }: {
    walletAddress: string;
    limit: number;
    page: number;
  
  }

): Promise<ResultProps> {

  const client = await clientPromise;
  const collection = client.db('vienna').collection('orders');

  const results = await collection.find<UserProps>(
    { walletAddress: walletAddress },
    { projection: { _id: 0, emailVerified: 0 } }
  ).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit).toArray();

  return {
    totalCount: results.length,
    orders: results,
  };

}



// accept sell order
// update order status to accepted

export async function acceptSellOrder(data: any) {
  
  ///console.log('acceptSellOrder data: ' + JSON.stringify(data));

  if (!data.orderId || !data.buyerWalletAddress || !data.buyerNickname || !data.buyerAvatar || !data.buyerMobile) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('orders');

  // random number for tradeId
  // 100000 ~ 999999 string

  const tradeId = Math.floor(Math.random() * 900000) + 100000 + '';

  const result = await collection.updateOne(
    
    { _id: new ObjectId(data.orderId) },


    { $set: {
      status: 'accepted',
      acceptedAt: new Date().toISOString(),


      tradeId: tradeId,

      buyer: {
        walletAddress: data.buyerWalletAddress,
        nickname: data.buyerNickname,
        avatar: data.buyerAvatar,
        mobile: data.buyerMobile,

      },
    } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { _id: new ObjectId(data.orderId) },
      { projection: { _id: 0, emailVerified: 0 } }
    );

    return updated;
  } else {
    return null;
  }
  
}






export async function requestPayment(data: any) {
  
  ///console.log('acceptSellOrder data: ' + JSON.stringify(data));

  if (!data.orderId) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('orders');


  const result = await collection.updateOne(
    
    { _id: new ObjectId(data.orderId) },


    { $set: {
      status: 'paymentRequested',
      paymentRequestedAt: new Date().toISOString(),
    } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { _id: new ObjectId(data.orderId) }
    );

    return updated;
  } else {
    return null;
  }
  
}





export async function confirmPayment(data: any) {
  
  ///console.log('acceptSellOrder data: ' + JSON.stringify(data));

  if (!data.orderId) {
    return null;
  }

  const client = await clientPromise;
  const collection = client.db('vienna').collection('orders');


  const result = await collection.updateOne(
    
    { _id: new ObjectId(data.orderId) },


    { $set: {
      status: 'paymentConfirmed',
      paymentConfirmedAt: new Date().toISOString(),
    } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { _id: new ObjectId(data.orderId) }
    );

    return updated;
  } else {
    return null;
  }
  
}





// get sell orders by wallet address order by createdAt desc
export async function getTradesByWalletAddress(

  {
    walletAddress,
    limit,
    page,
  }: {
    walletAddress: string;
    limit: number;
    page: number;
  
  }

): Promise<ResultProps> {



  const client = await clientPromise;
  const collection = client.db('vienna').collection('orders');


  // get orders by buyer.walletAddress = walletAddress 
  // tradeId is not null

  const results = await collection.find<UserProps>(

    { 'buyer.walletAddress': walletAddress, tradeId: { $ne: null } },

  ).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit).toArray();


  return {
    totalCount: results.length,
    orders: results,
  };

}




// get sell trades by wallet address order by createdAt desc
export async function getSellTradesByWalletAddress(

  {
    walletAddress,
    limit,
    page,
  }: {
    walletAddress: string;
    limit: number;
    page: number;
  
  }

): Promise<ResultProps> {



  const client = await clientPromise;
  const collection = client.db('vienna').collection('orders');


  // get orders by buyer.walletAddress = walletAddress 
  // tradeId is not null

  const results = await collection.find<UserProps>(

    { 'walletAddress': walletAddress, tradeId: { $ne: null } },

  ).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit).toArray();


  return {
    totalCount: results.length,
    orders: results,
  };

}








export async function updateOne(data: any) {
  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  // update and return updated user

  if (!data.walletAddress || !data.nickname) {
    return null;
  }


  const result = await collection.updateOne(
    { walletAddress: data.walletAddress },
    { $set: { nickname: data.nickname } }
  );

  if (result) {
    const updated = await collection.findOne<UserProps>(
      { walletAddress: data.walletAddress },
      { projection: { _id: 0, emailVerified: 0 } }
    );

    return updated;
  }


}




export async function getOneByWalletAddress(
  walletAddress: string,
): Promise<UserProps | null> {

  console.log('getOneByWalletAddress walletAddress: ' + walletAddress);

  const client = await clientPromise;
  const collection = client.db('vienna').collection('users');


  // id is number

  const results = await collection.findOne<UserProps>(
    { walletAddress: walletAddress },
    { projection: { _id: 0, emailVerified: 0 } }
  );


  console.log('getOneByWalletAddress results: ' + results);

  return results;

}






export async function getUserWalletPrivateKeyByWalletAddress(
  walletAddress: string,
): Promise<string | null> {

  const client = await clientPromise;
  const collection = client.db('lefimall').collection('users');

  const results = await collection.findOne<UserProps>(
    { walletAddress },
    { projection: { _id: 0, emailVerified: 0 } }
  ) as any;

  console.log('getUserWalletPrivateKeyByWalletAddress results: ' + results);

  if (results) {
    return results.walletPrivateKey;
  } else {
    return null;
  }

}


export async function getUserByEmail(
  email: string,
): Promise<UserProps | null> {

  console.log('getUser email: ' + email);

  const client = await clientPromise;
  const collection = client.db('lefimall').collection('users');


  return await collection.findOne<UserProps>(
    { email },
    { projection: { _id: 0, emailVerified: 0 } }
  );

}








export async function getUserCount(): Promise<number> {
  const client = await clientPromise;
  const collection = client.db('lefimall').collection('users');
  return await collection.countDocuments();
}



export async function updateUser(username: string, bio: string) {
  const client = await clientPromise;
  const collection = client.db('lefimall').collection('users');
  return await collection.updateOne({ username }, { $set: { bio } });
}




export async function checkUser(id: string, password: string): Promise<UserProps | null> {
  

  const client = await clientPromise;
  const collection = client.db('lefimall').collection('users');
  const results = await collection.findOne<UserProps>(
    {
      id,
      password,
    },
    { projection: { _id: 0, emailVerified: 0 } }
  );
  if (results) {
    return {
      ...results,
      //bioMdx: await getMdxSource(results.bio || placeholderBio)
    };
  } else {
    return null;
  }
}





