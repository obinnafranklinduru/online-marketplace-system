import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";

const S3Client = new S3();

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const file = event.queryStringParameters?.file;

  const fileName = `${uuid()}__${file}`;

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: event.body,
    ACL: "public-read",
    ContentType: event.headers["content-type"],
    CacheControl: "max-age=31536000",
    ContentDisposition: `inline; filename="${fileName}"`,
  };

  const url = await S3Client.getSignedUrlPromise("putObject", s3Params);
  console.log("UPLOAD_URL", s3Params, url);

  return {
    statusCode: 200,
    body: JSON.stringify({ url, key: fileName }),
  };
};
