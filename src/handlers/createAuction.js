import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../libs/commonMiddleware";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: new Date().toISOString(),
  };

  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(auction),
    };
  } catch (error) {
    console.log("Error ", error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(createAuction);
