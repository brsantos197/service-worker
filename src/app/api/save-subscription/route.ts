import webpush from 'web-push'

import { NextResponse } from "next/server";
import { env } from 'process';
import fs from 'fs';
import { randomUUID } from 'crypto';
const apiKeys = {
  publicKey: env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  privateKey: env.WEB_PUSH_PRIVATE_KEY
} as {
  publicKey: string
  privateKey: string}

webpush.setVapidDetails(
  'mailto:YOUR_MAILTO_STRING',
  apiKeys.publicKey,
  apiKeys.privateKey
)

export async function POST(request: Request) {
  const body = await request.json();
  let db = [];
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    }
    if (data) {
      db = JSON.parse(data);
    }
  });
  const subscription = {
    id: randomUUID(),
    ...body
  }
  db.push(subscription)
  // generate a json file with fs
  fs.writeFile('data.json', JSON.stringify(db, null, 2), (err) => {
    if (err) throw err;
    console.log('JSON data has been saved to data.json');
  });
  return NextResponse.json({ subscription })
}