'use server';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import slugify from '@sindresorhus/slugify';
import path from 'node:path';

import { ONE_HOUR, ONE_SECOND } from '../../constants/time';
import { getServerComponentSession } from '../../next-auth/get-server-session';
import { alphaid } from '../id';

export const getPresignPostUrl = async (fileName: string, contentType: string) => {
  const client = getS3Client();

  const user = await getServerComponentSession();

  // Get the basename and extension for the file
  const { name, ext } = path.parse(fileName);

  let key = `${alphaid(12)}/${slugify(name)}${ext}`;

  if (user) {
    key = `${user.id}/${key}`;
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.NEXT_PRIVATE_UPLOAD_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(client, putObjectCommand, {
    expiresIn: ONE_HOUR / ONE_SECOND,
  });

  return { key, url };
};

export const getAbsolutePresignPostUrl = async (key: string) => {
  const client = getS3Client();

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.NEXT_PRIVATE_UPLOAD_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(client, putObjectCommand, {
    expiresIn: ONE_HOUR / ONE_SECOND,
  });

  return { key, url };
};

export const getPresignGetUrl = async (key: string) => {
  const client = getS3Client();

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.NEXT_PRIVATE_UPLOAD_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(client, getObjectCommand, {
    expiresIn: ONE_HOUR / ONE_SECOND,
  });

  return { key, url };
};

export const deleteS3File = async (key: string) => {
  const client = getS3Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: process.env.NEXT_PRIVATE_UPLOAD_BUCKET,
      Key: key,
    }),
  );
};

const getS3Client = () => {
  if (process.env.NEXT_PUBLIC_UPLOAD_TRANSPORT !== 's3') {
    throw new Error('Invalid upload transport');
  }

  const hasCredentials =
    process.env.NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID &&
    process.env.NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY;

  return new S3Client({
    endpoint: process.env.NEXT_PRIVATE_UPLOAD_ENDPOINT || undefined,
    region: process.env.NEXT_PRIVATE_UPLOAD_REGION || 'us-east-1',
    credentials: hasCredentials
      ? {
          accessKeyId: String(process.env.NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID),
          secretAccessKey: String(process.env.NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY),
        }
      : undefined,
  });
};
