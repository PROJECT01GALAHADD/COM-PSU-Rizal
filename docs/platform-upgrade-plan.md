# Platform Upgrade Plan
## Based on Vercel Best Practices & Official Repositories

This document outlines planned upgrades to the PSU Rizal Platform using production-proven patterns from Vercel's official repositories.

---

## 🎯 Upgrade Goals

1. **Fix WebRTC Cross-Device Connectivity** (Critical)
2. **Add Optional Vercel Blob Storage** (File uploads expansion)
3. **Implement Feature Flags** (Production flexibility)
4. **Add Error Monitoring** (Production stability)
5. **Improve Code Quality** (Patterns from next-forge)

---

## 📦 Package Additions

### Core Packages
```json
{
  "@vercel/blob": "latest",
  "@vercel/flags": "latest",
  "@vercel/analytics": "latest",
  "@sentry/nextjs": "latest",
  "pusher": "latest",
  "pusher-js": "latest",
  "socket.io-client": "latest"
}
```

---

## 1. WebRTC Signaling Fix (Critical Priority)

### Problem
Current implementation lacks a signaling server, preventing cross-device video calls.

### Solution: Pusher Integration (Vercel-Compatible)

**Why Pusher?**
- ✅ Works on Vercel (WebSocket not supported in serverless)
- ✅ Free tier: 100 concurrent connections, 200k messages/day
- ✅ Built-in presence channels for participant tracking
- ✅ No custom backend required

#### Installation
```bash
pnpm add pusher pusher-js
```

#### Setup Environment Variables
```env
# .env.local
NEXT_PUBLIC_PUSHER_KEY=your_key
NEXT_PUBLIC_PUSHER_CLUSTER=us2
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_secret
```

#### Implementation

**1. Create Pusher Server Client** (`lib/pusher/server.ts`):
```typescript
import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true
});
```

**2. Update WebRTC Hook** (`hooks/use-webrtc-with-pusher.ts`):
```typescript
import Pusher from 'pusher-js';
import { useEffect, useRef, useState } from 'react';

export function useWebRTCWithPusher(meetingId: string, userId: string) {
  const pusherRef = useRef<Pusher | null>(null);
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());

  useEffect(() => {
    // Initialize Pusher
    pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusherRef.current.subscribe(`presence-meeting-${meetingId}`);

    // Handle new peer joining
    channel.bind('pusher:member_added', async (member: any) => {
      if (member.id === userId) return; // Don't connect to self
      
      const peerConnection = createPeerConnection(member.id);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send offer via Pusher
      await fetch('/api/signaling/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId,
          targetId: member.id,
          offer: peerConnection.localDescription
        })
      });
    });

    // Handle WebRTC offer
    channel.bind('webrtc-offer', async ({ from, offer }: any) => {
      const peerConnection = createPeerConnection(from);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send answer via Pusher
      await fetch('/api/signaling/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId,
          targetId: from,
          answer: peerConnection.localDescription
        })
      });
    });

    // Handle WebRTC answer
    channel.bind('webrtc-answer', async ({ from, answer }: any) => {
      const pc = peerConnections.get(from);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Handle ICE candidate
    channel.bind('ice-candidate', async ({ from, candidate }: any) => {
      const pc = peerConnections.get(from);
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      pusherRef.current?.disconnect();
      peerConnections.forEach(pc => pc.close());
    };
  }, [meetingId, userId]);

  function createPeerConnection(peerId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Handle ICE candidate
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await fetch('/api/signaling/ice-candidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meetingId,
            targetId: peerId,
            candidate: event.candidate
          })
        });
      }
    };

    // Handle remote track
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      // Add to remote streams state
    };

    peerConnections.set(peerId, pc);
    return pc;
  }

  return {
    peerConnections,
    // ... other WebRTC methods
  };
}
```

**3. Create Pusher API Routes**:

`app/api/signaling/offer/route.ts`:
```typescript
import { pusher } from '@/lib/pusher/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { meetingId, targetId, offer } = await request.json();
  
  await pusher.trigger(
    `presence-meeting-${meetingId}`,
    'webrtc-offer',
    { from: request.headers.get('x-user-id'), offer }
  );

  return NextResponse.json({ success: true });
}
```

**Benefits:**
- ✅ Works on Vercel production
- ✅ No custom WebSocket server needed
- ✅ Built-in presence (who's online)
- ✅ Reliable message delivery

---

## 2. Vercel Blob Storage Integration

### Purpose
Expand file storage options (doesn't replace Replit Object Storage)

### Installation
```bash
pnpm add @vercel/blob
```

### Implementation

**Storage Abstraction Layer** (`lib/storage/adapter.ts`):
```typescript
import { put as vercelPut, del as vercelDel } from '@vercel/blob';
import { Client } from '@replit/object-storage';

type StorageProvider = 'vercel' | 'replit' | 'local';

interface StorageAdapter {
  upload(file: File, key: string): Promise<string>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}

export function createStorageAdapter(provider: StorageProvider): StorageAdapter {
  switch (provider) {
    case 'vercel':
      return {
        async upload(file, key) {
          const blob = await vercelPut(key, file, {
            access: 'public',
            addRandomSuffix: false,
          });
          return blob.url;
        },
        async delete(key) {
          await vercelDel(key);
        },
        getUrl(key) {
          return `${process.env.BLOB_READ_WRITE_TOKEN}/${key}`;
        }
      };

    case 'replit':
      return {
        async upload(file, key) {
          const client = new Client();
          const buffer = await file.arrayBuffer();
          await client.uploadFromBytes(key, Buffer.from(buffer));
          return `/api/files/${key}`;
        },
        async delete(key) {
          const client = new Client();
          await client.delete(key);
        },
        getUrl(key) {
          return `/api/files/${key}`;
        }
      };

    case 'local':
      return {
        async upload(file, key) {
          // Local filesystem implementation
          return `/tmp/uploads/${key}`;
        },
        async delete(key) {
          // Delete from local filesystem
        },
        getUrl(key) {
          return `/tmp/uploads/${key}`;
        }
      };
  }
}

// Auto-detect provider based on environment
export function getStorageProvider(): StorageProvider {
  if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) return 'vercel';
  if (process.env.REPL_ID) return 'replit';
  return 'local';
}

export const storage = createStorageAdapter(getStorageProvider());
```

**Usage in API Routes**:
```typescript
import { storage } from '@/lib/storage/adapter';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const url = await storage.upload(file, `assignments/${file.name}`);
  
  return Response.json({ url });
}
```

**Benefits:**
- ✅ Works on Replit, Vercel, and local
- ✅ Easy to add more storage providers
- ✅ Doesn't break existing functionality

---

## 3. Feature Flags with @vercel/flags

### Purpose
Toggle features on/off without redeploying

### Installation
```bash
pnpm add @vercel/flags
```

### Setup

**Create Flags Provider** (`lib/flags/provider.ts`):
```typescript
import { decrypt, verifyAccess, type ApiData } from '@vercel/flags';
import { FlagDefinitionsType } from '@vercel/flags/react';

export const flagsConfig: FlagDefinitionsType = {
  enableVideoConferencing: {
    description: 'Enable video conferencing feature',
    origin: 'https://your-app.vercel.app/api/flags',
    options: [
      { value: false, label: 'Disabled' },
      { value: true, label: 'Enabled' },
    ],
  },
  enableAIAssistant: {
    description: 'Enable AI teaching assistant',
    origin: 'https://your-app.vercel.app/api/flags',
    options: [
      { value: false, label: 'Disabled' },
      { value: true, label: 'Enabled' },
    ],
  },
  maxMeetingParticipants: {
    description: 'Maximum participants per meeting',
    origin: 'https://your-app.vercel.app/api/flags',
    options: [
      { value: 10, label: '10 participants' },
      { value: 50, label: '50 participants' },
      { value: 100, label: '100 participants' },
    ],
  },
};
```

**API Route** (`app/api/flags/route.ts`):
```typescript
import { flagsConfig } from '@/lib/flags/provider';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    definitions: flagsConfig,
  });
}
```

**Usage in Components**:
```typescript
import { useFlag } from '@vercel/flags/react';

export function VideoConferenceButton() {
  const enableVideoConferencing = useFlag('enableVideoConferencing');

  if (!enableVideoConferencing) {
    return <div>Video conferencing currently disabled</div>;
  }

  return <button>Start Meeting</button>;
}
```

**Benefits:**
- ✅ Enable/disable features without redeployment
- ✅ A/B testing capabilities
- ✅ Gradual rollouts
- ✅ Emergency kill switches

---

## 4. Error Monitoring with Sentry

### Installation
```bash
npx @sentry/wizard@latest -i nextjs
```

### Configuration

**`sentry.client.config.ts`**:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: false,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

**`sentry.server.config.ts`**:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Usage - Automatic Error Capture**:
```typescript
// Errors are captured automatically
try {
  await riskyOperation();
} catch (error) {
  // Automatically sent to Sentry
  Sentry.captureException(error);
  throw error;
}
```

**Benefits:**
- ✅ Real-time error tracking
- ✅ Performance monitoring
- ✅ User session replay
- ✅ Stack traces with source maps

---

## 5. Code Quality Improvements (from next-forge)

### Patterns to Adopt

**1. Proper Error Handling**:
```typescript
// Before
const data = await fetch('/api/users').then(r => r.json());

// After (with error handling)
async function getUsers() {
  try {
    const response = await fetch('/api/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    Sentry.captureException(error);
    throw new Error('Failed to fetch users');
  }
}
```

**2. Type-Safe API Responses**:
```typescript
// lib/api/types.ts
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Usage
export async function getUser(id: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: 'User not found' };
  }
}
```

**3. Environment Variable Validation** (`lib/env.ts`):
```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PUSHER_APP_ID: z.string(),
  NEXT_PUBLIC_PUSHER_KEY: z.string(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

---

## 6. Testing Setup

### Installation
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

### Configuration

**`vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
```

**Example Test** (`components/__tests__/Button.test.tsx`):
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '../ui/button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 📊 Implementation Priority

### Phase 1: Critical (Week 1)
1. ✅ **Pusher WebRTC Signaling** - Fix cross-device video calls
2. ✅ **Error Monitoring** - Production stability

### Phase 2: Important (Week 2)
3. ✅ **Vercel Blob Storage** - File upload improvements
4. ✅ **Feature Flags** - Production flexibility

### Phase 3: Nice-to-Have (Week 3)
5. ✅ **Testing Setup** - Long-term code quality
6. ✅ **Code Refactoring** - Apply next-forge patterns

---

## 🔄 Migration Strategy

### For Replit Deployment
- All features work as-is
- Pusher provides signaling (no custom server needed)
- Replit Object Storage remains default

### For Vercel Deployment
- Pusher handles WebRTC signaling
- Vercel Blob Storage automatically used
- PostgreSQL via Vercel Postgres or Neon

### For Firebase Deployment
- Pusher for signaling
- Firebase Storage via adapter pattern
- Firestore or PostgreSQL

---

## 💰 Cost Estimate

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| **Pusher** | 100 connections, 200k msgs/day | $49/month (1,000 connections) |
| **Vercel Blob** | 500 MB, 1,000 writes/month | $0.15/GB stored, $2/GB transferred |
| **Sentry** | 5k errors/month | $26/month (50k errors) |
| **Total** | **$0 for development** | **~$75/month for production** |

---

## 📝 Next Steps

1. **Get Pusher Account**: https://pusher.com/signup
2. **Install Packages**: Run `pnpm add pusher pusher-js @vercel/blob @vercel/flags`
3. **Configure Environment**: Add Pusher credentials to Secrets
4. **Test WebRTC**: Verify cross-device video calls work
5. **Deploy**: Push to GitHub and deploy on Vercel

---

## 🔗 Resources

- **Pusher Docs**: https://pusher.com/docs/channels/getting_started/javascript
- **Vercel Blob**: https://vercel.com/docs/storage/vercel-blob
- **Vercel Flags**: https://vercel.com/docs/workflow-collaboration/feature-flags
- **Sentry Next.js**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Next-Forge**: https://www.next-forge.com/

---

**Status**: Ready for implementation 🚀
