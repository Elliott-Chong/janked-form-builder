import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { Bucket } from "sst/node/bucket";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { ContentType } = req.body as { ContentType: string };
    if (!ContentType)
      return res.status(400).json({ message: "No content type provided" });
    const command = new PutObjectCommand({
      ACL: "public-read",
      Key: crypto.randomUUID(),
      Bucket: Bucket.public.bucketName,
      ContentType,
    });
    const url = await getSignedUrl(new S3Client({}), command, {
      expiresIn: 1 * 60,
    });
    return res.status(200).json({ url });
  } else {
    res.status(500).json({ message: "gay" });
  }
}
