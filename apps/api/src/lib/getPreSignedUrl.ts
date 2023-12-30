import 'dotenv/config';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } =
  process.env;

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: (R2_ACCESS_KEY_ID as string) || '',
    secretAccessKey: (R2_SECRET_ACCESS_KEY as string) || '',
  },
});

export const getPreSignedUrl = async (fileUploadName: string) => {
  const presignedUrl = await getSignedUrl(
    S3,
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileUploadName,
      ACL: 'public-read',
    }),
    {
      expiresIn: 60, // 1 minute
    },
  );

  return presignedUrl;
};
