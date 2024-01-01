import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import 'dotenv/config';
import { s3 } from '../config/s3';

export const getPreSignedUrl = async (fileUploadName: string) => {
  const presignedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileUploadName,
      ACL: 'public-read',
    }),
    {
      expiresIn: 60, // 1 minute
    },
  );

  return presignedUrl;
};
