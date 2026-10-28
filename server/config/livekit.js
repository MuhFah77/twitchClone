import { IngressClient, RoomServiceClient } from 'livekit-server-sdk';

const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
const httpHost = (LIVEKIT_URL || '').replace(/^wss:/, 'https:').replace(/^ws:/, 'http:');

export const livekit = { url: LIVEKIT_URL, key: LIVEKIT_API_KEY, secret: LIVEKIT_API_SECRET };
export const ingressClient = new IngressClient(httpHost, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
export const roomService = new RoomServiceClient(httpHost, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
