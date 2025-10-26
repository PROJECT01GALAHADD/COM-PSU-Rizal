import { NextRequest, NextResponse } from 'next/server';
import { getTwilioCredentials } from '@/lib/twilio/server';
import { jwt } from 'twilio';

const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

export async function POST(request: NextRequest) {
  try {
    const { identity, roomName } = await request.json();

    if (!identity || !roomName) {
      return NextResponse.json(
        { error: 'Missing identity or roomName' },
        { status: 400 }
      );
    }

    const credentials = await getTwilioCredentials();
    const { accountSid, apiKey, apiKeySecret } = credentials;

    const token = new AccessToken(
      accountSid,
      apiKey,
      apiKeySecret,
      { identity }
    );

    const videoGrant = new VideoGrant({
      room: roomName,
    });

    token.addGrant(videoGrant);

    return NextResponse.json({
      token: token.toJwt(),
      identity,
      roomName
    });
  } catch (error) {
    console.error('Error generating Twilio token:', error);
    return NextResponse.json(
      { error: 'Failed to generate access token' },
      { status: 500 }
    );
  }
}
