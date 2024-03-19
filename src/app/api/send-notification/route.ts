import webpush from 'web-push'

import { NextResponse } from "next/server";
import { env } from 'process';
import { readFile } from 'fs/promises';
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
 let db: Array<webpush.PushSubscription & { id: string }> = [];

  try {
    const data = await readFile('data.json', 'utf8');
    db = JSON.parse(data);
    const subscription = db.find(sub => sub.id === body.id)
    if (subscription) {
      webpush.sendNotification(subscription, body.message || 'Hello, World!');
      return NextResponse.json({ subscription })
    }
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ erro: 'subscription not found' }, { status: 404 })
}