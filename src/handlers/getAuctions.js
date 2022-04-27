import AWS from "aws-sdk";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createError from "http-errors";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  try {
    let auctions = [];

    const result = await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise();

    auctions = result.Items;

    return {
      statusCode: 200,
      body: JSON.stringify(auctions),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
