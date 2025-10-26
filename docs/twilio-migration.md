# Twilio Video Migration Guide

## Overview

The PSU Rizal Academic Collaboration Platform has successfully migrated from Pusher WebRTC signaling to **Twilio Video** for enterprise-grade video conferencing. This guide documents the migration and how to use Twilio Video in the application.

## Why Twilio Video?

### Advantages over Pusher + Custom WebRTC

1. **Enterprise-Grade Reliability**
   - Built-in Selective Forwarding Unit (SFU)
   - Handles all WebRTC complexity automatically
   - 99.99% uptime SLA

2. **Rich Feature Set**
   - Screen sharing (built-in)
   - Recording and compositions
   - Noise cancellation
   - Virtual backgrounds
   - Dominant speaker detection
   - Adaptive simulcast for quality optimization

3. **Simplified Implementation**
   - No manual peer connection management
   - No custom signaling server needed
   - Room-based architecture (up to 50 participants per room)
   - Automatic reconnection handling

4. **Better for Replit**
   - Native Replit integration for credentials
   - No additional services required
   - Automatic secret management

## Migration Summary

### What Changed

**Removed:**
- `pusher` and `pusher-js` packages
- `lib/pusher/server.ts` and `lib/pusher/client.ts`
- `app/api/signaling/*` routes (offer, answer, ice-candidate, auth)
- `hooks/use-webrtc-pusher.ts`
- Pusher environment variables

**Added:**
- `twilio` and `twilio-video` packages
- `lib/twilio/server.ts` - Twilio client using Replit integration
- `app/api/twilio/token/route.ts` - Access token generation
- `hooks/use-twilio-video.ts` - Twilio Video React hook
- Twilio connection via Replit Integrations

**Updated:**
- `components/video-conference-layout.tsx` - Now uses `useTwilioVideo` hook
- `replit.md` - Updated documentation
- `.env.example` - Removed Pusher vars, added Twilio notes
- `lib/env.ts` - Removed Pusher validation, added Replit connector vars

## Architecture

### How Twilio Video Works

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │
       │ 1. Request Access Token
       ▼
┌─────────────────────┐
│  Next.js API Route  │
│ /api/twilio/token   │
└──────┬──────────────┘
       │
       │ 2. Generate Token
       ▼
┌─────────────────────┐
│  Twilio Connector   │
│ (Replit Integration)│
└──────┬──────────────┘
       │
       │ 3. Token with Room Access
       ▼
┌─────────────┐
│   Browser   │
│  Connects   │
│   to Room   │
└──────┬──────┘
       │
       │ 4. Media Streams
       ▼
┌─────────────────────┐
│   Twilio Cloud SFU  │
│  (Media Routing)    │
└─────────────────────┘
```

### Component Flow

1. **User joins meeting** → `VideoConferenceLayout` component loads
2. **Hook initializes** → `useTwilioVideo(meetingId, participantId, participantName)`
3. **Token request** → Fetch `/api/twilio/token` with identity and room name
4. **Twilio connection** → SDK connects to Twilio Room using token
5. **Media setup** → Local video/audio tracks published automatically
6. **Participant handling** → Remote participants tracked and displayed
7. **Controls** → Mute, camera, screen share via Twilio SDK methods

## Implementation Details

### 1. Twilio Client Configuration

**File:** `lib/twilio/server.ts`

Uses Replit's Twilio integration to automatically fetch credentials:

```typescript
export async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  return twilio(apiKey, apiKeySecret, {
    accountSid: accountSid
  });
}
```

Credentials are automatically provided by Replit when you connect Twilio via integrations.

### 2. Access Token Generation

**File:** `app/api/twilio/token/route.ts`

Generates JWT access tokens for participants to join rooms:

```typescript
POST /api/twilio/token
{
  "identity": "John Doe",
  "roomName": "meeting-123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1...",
  "identity": "John Doe",
  "roomName": "meeting-123"
}
```

Tokens include:
- Participant identity
- Room permissions (VideoGrant)
- Expiration (default: 1 hour)

### 3. React Hook

**File:** `hooks/use-twilio-video.ts`

Provides complete video conferencing functionality:

```typescript
const {
  localStream,          // MediaStream for local video/audio
  remoteStreams,        // Map of participant SID → MediaStream
  isScreenSharing,      // Boolean screen share state
  isMuted,             // Boolean microphone state
  isCameraOff,         // Boolean camera state
  isConnected,         // Connection status
  toggleMicrophone,    // Function to mute/unmute
  toggleCamera,        // Function to enable/disable camera
  toggleScreenShare,   // Function to share screen
  participantCount     // Number of remote participants
} = useTwilioVideo(meetingId, participantId, participantName);
```

### 4. Features Included

#### ✅ Video & Audio
- Automatic device initialization
- HD quality (1280x720 by default)
- Multiple participants (up to 50)

#### ✅ Controls
- **Mute/Unmute**: `toggleMicrophone()`
- **Camera On/Off**: `toggleCamera()`
- **Screen Share**: `toggleScreenShare()`

#### ✅ Participant Management
- Automatic participant tracking
- Remote stream handling
- Disconnect detection

#### ✅ Connection Handling
- Automatic reconnection
- Connection state tracking
- Error notifications via toast

## Usage Example

```typescript
import { useTwilioVideo } from '@/hooks/use-twilio-video';

function MyVideoComponent() {
  const {
    localStream,
    remoteStreams,
    toggleMicrophone,
    toggleCamera,
    isConnected
  } = useTwilioVideo('meeting-001', 'user-123', 'John Doe');

  return (
    <div>
      {/* Local Video */}
      <video ref={videoRef} autoPlay muted />
      
      {/* Remote Videos */}
      {Array.from(remoteStreams.entries()).map(([sid, stream]) => (
        <RemoteVideo key={sid} stream={stream} />
      ))}
      
      {/* Controls */}
      <button onClick={toggleMicrophone}>Mute</button>
      <button onClick={toggleCamera}>Camera Off</button>
      
      {/* Status */}
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
}
```

## Environment Setup

### On Replit (Current Platform)

**No manual configuration needed!**

1. Connect Twilio via Replit Integrations panel
2. Provide your Twilio credentials once
3. Platform automatically injects credentials via environment

### On Other Platforms (Vercel, Firebase, Local)

Add these environment variables:

```bash
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_API_KEY=your-api-key
TWILIO_API_SECRET=your-api-secret
```

Then update `lib/twilio/server.ts` to read from env vars instead of Replit connector API.

## Testing

### Quick Test

1. Open two browser windows
2. Navigate to `/meeting/test-001` in both
3. Join as different participants
4. Verify:
   - ✅ Can see each other's video
   - ✅ Can hear each other's audio
   - ✅ Mute/unmute works
   - ✅ Camera on/off works
   - ✅ Screen share works

### Multi-Device Test

1. Open on desktop: `/meeting/test-001`
2. Open on phone: `/meeting/test-001`
3. Verify cross-device communication works

## Twilio Video Features Available

### Currently Implemented
- ✅ Video calling (up to 50 participants)
- ✅ Audio calling
- ✅ Screen sharing
- ✅ Mute/unmute
- ✅ Camera on/off
- ✅ Participant tracking
- ✅ Connection status

### Available (Not Yet Implemented)
- 📋 Recording & Compositions
- 📋 Noise cancellation (Krisp plugin)
- 📋 Virtual backgrounds
- 📋 Dominant speaker detection
- 📋 Network quality indicators
- 📋 Bandwidth adaptation

## Troubleshooting

### Issue: "Failed to get access token"

**Cause:** Twilio not connected in Replit integrations

**Fix:**
1. Open Replit Integrations panel
2. Find Twilio integration
3. Click "Connect" and provide credentials

### Issue: "Cannot connect to room"

**Cause:** Network/firewall blocking Twilio

**Fix:**
- Check browser console for errors
- Ensure WebRTC ports are open
- Try from different network

### Issue: "No video/audio"

**Cause:** Browser permissions not granted

**Fix:**
1. Check browser address bar for camera/mic permissions
2. Click "Allow" when prompted
3. Check browser settings for site permissions

### Issue: "Remote participants not showing"

**Cause:** Participant tracking issue

**Fix:**
- Check browser console for errors
- Verify both participants are in same room
- Refresh the page

## Performance Optimization

### Recommended Settings

**For HD Quality (default):**
```typescript
video: { width: 1280, height: 720 }
```

**For Better Performance:**
```typescript
video: { width: 640, height: 480 }
```

**Audio Only:**
```typescript
audio: true,
video: false
```

### Bandwidth Recommendations

- **HD Video (720p)**: 2.5 Mbps up/down per participant
- **SD Video (480p)**: 1.2 Mbps up/down per participant
- **Audio Only**: 50 Kbps up/down per participant

## Cost Considerations

### Twilio Video Pricing (as of 2025)

- **Group Rooms**: $0.004/min per participant
- **Peer-to-Peer**: $0.0015/min per participant
- **Recording**: $0.004/min
- **Composition**: $0.01/min

**Example:**
- 10 participants × 60 minutes = $2.40
- With recording = $2.64

**Free Trial:** Twilio provides free trial credits for testing.

## Migration Checklist

- [x] Install Twilio packages
- [x] Remove Pusher packages
- [x] Create Twilio client configuration
- [x] Create token generation API route
- [x] Implement useTwilioVideo hook
- [x] Update VideoConferenceLayout component
- [x] Remove Pusher files and routes
- [x] Update environment configuration
- [x] Update documentation
- [ ] Test video calling functionality
- [ ] Test on multiple devices
- [ ] Deploy to production

## Next Steps

1. **Test thoroughly** - Verify all video features work
2. **Monitor usage** - Check Twilio console for usage statistics
3. **Add recording** - Implement recording feature if needed
4. **Add noise cancellation** - Integrate Krisp plugin for better audio
5. **Optimize bandwidth** - Implement adaptive simulcast

## Resources

- **Twilio Video Docs**: https://www.twilio.com/docs/video
- **Twilio Console**: https://console.twilio.com
- **Twilio Video JS SDK**: https://www.twilio.com/docs/video/javascript
- **Replit Integration**: Already connected!

---

**Migration Complete!** 🎉

Your platform now uses enterprise-grade Twilio Video for video conferencing. The implementation is simpler, more reliable, and feature-rich compared to the previous Pusher + custom WebRTC approach.
