import AWS from "aws-sdk";

import createError from "http-errors";
import commonMiddleware from "../libs/commonMiddleware";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auction = null;

  const { id } = event.pathParameters;

  try {

    const result = await dynamoDB.get({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id}
    }).promise();

    auction = result.Item;
    
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
      throw new createError.NotFound(`Auction with ID ${id} not found`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuctions);
