import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;

export const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: (R2_ACCESS_KEY_ID as string) || '',
    secretAccessKey: (R2_SECRET_ACCESS_KEY as string) || '',
  },
});
