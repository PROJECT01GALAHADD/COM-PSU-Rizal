# Video Conferencing Documentation

## Current Implementation Status

### ✅ What's Working
- **Guest Access**: Users can join meetings without registration using `/guest` page or `guest=true` parameter
- **Local Media**: Camera and microphone access working via WebRTC
- **UI Controls**: Full control panel with mute, video toggle, screen share buttons
- **Post-Meeting Experience**: Rating modal appears after ending call, redirects to landing page
- **Meeting Interface**: Beautiful glass-morphism UI with participant list and chat
- **Meeting Duration Tracker**: Live timer showing elapsed meeting time

### ⚠️ Current Limitations
- **No Cross-Device Connectivity**: Meetings currently use mock data and won't connect across different devices
- **No Real-Time Signaling**: WebSocket implementation is simulated - needs backend server
- **Chat Not Persisted**: Messages are client-side only, not synchronized across participants
- **Participant List Static**: Shows mock participants, not real connected users

---

## How to Enable Cross-Device Video Calls

To make video conferencing work across multiple devices, you need a **WebRTC signaling server**. Here are your options:

### Option 1: Simple WebSocket Server (Recommended for Testing)
Use a lightweight Node.js WebSocket server for signaling:

```bash
npm install ws socket.io
```

**Create `server/signaling-server.js`:**
```javascript
const { Server } = require('socket.io');
const io = new Server(3001, {
  cors: { origin: '*' }
});

const meetings = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-meeting', ({ meetingId, participantName }) => {
    socket.join(meetingId);
    
    if (!meetings.has(meetingId)) {
      meetings.set(meetingId, new Set());
    }
    meetings.get(meetingId).add(socket.id);

    // Notify others in the room
    socket.to(meetingId).emit('user-joined', {
      participantId: socket.id,
      participantName
    });

    // Send existing participants to new user
    const existingParticipants = Array.from(meetings.get(meetingId))
      .filter(id => id !== socket.id);
    socket.emit('existing-participants', existingParticipants);
  });

  socket.on('webrtc-offer', ({ meetingId, targetId, offer }) => {
    io.to(targetId).emit('webrtc-offer', {
      from: socket.id,
      offer
    });
  });

  socket.on('webrtc-answer', ({ meetingId, targetId, answer }) => {
    io.to(targetId).emit('webrtc-answer', {
      from: socket.id,
      answer
    });
  });

  socket.on('ice-candidate', ({ meetingId, targetId, candidate }) => {
    io.to(targetId).emit('ice-candidate', {
      from: socket.id,
      candidate
    });
  });

  socket.on('disconnect', () => {
    meetings.forEach((participants, meetingId) => {
      if (participants.has(socket.id)) {
        participants.delete(socket.id);
        socket.to(meetingId).emit('user-left', socket.id);
      }
    });
  });
});

console.log('Signaling server running on port 3001');
```

**Update `hooks/use-websocket.ts`** to connect to real server:
```typescript
useEffect(() => {
  const socket = io('http://localhost:3001');
  
  socket.emit('join-meeting', { meetingId, participantName });
  
  socket.on('user-joined', ({ participantId, participantName }) => {
    // Add new participant to list
  });
  
  socket.on('existing-participants', (participants) => {
    // Initialize peer connections
  });
  
  return () => socket.disconnect();
}, [meetingId]);
```

---

### Option 2: Use Replit Integration (Recommended for Production)

Search for WebRTC/signaling integrations:
```bash
# Use the Replit Agent search integrations tool
```

Potential services:
- **Agora** - Professional video API with built-in signaling
- **Twilio Video** - Enterprise-grade video calls
- **Daily.co** - Simple video API for web apps
- **100ms** - Modern video conferencing SDK

---

### Option 3: Firebase + Firestore (Hybrid Approach)

Use Firebase Firestore for signaling instead of WebSocket:

**Advantages:**
- No server to maintain
- Real-time sync built-in
- Works with your existing Replit + PostgreSQL setup

**Implementation:**
```typescript
// Store WebRTC offers/answers in Firestore
await setDoc(doc(db, 'meetings', meetingId, 'offers', peerId), {
  offer: rtcOffer,
  from: participantId,
  timestamp: serverTimestamp()
});

// Listen for answers
onSnapshot(doc(db, 'meetings', meetingId, 'answers', participantId), (doc) => {
  const answer = doc.data()?.answer;
  if (answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }
});
```

---

## Testing Guest Access (Current Implementation)

### How to Test Locally:

1. **Start the dev server:**
   ```bash
   pnpm run dev
   ```

2. **Create a meeting as a guest:**
   - Navigate to: `http://localhost:5000/guest`
   - Enter your name and a meeting title
   - Click "Create Meeting"

3. **Join an existing meeting as guest:**
   - Navigate to: `http://localhost:5000/guest`
   - Enter your name and meeting ID
   - Click "Join Meeting"

4. **Direct meeting link:**
   - Access: `http://localhost:5000/meetings/[meeting-id]?guest=true&name=YourName`

### Expected Behavior:
- ✅ Camera/mic permission requested
- ✅ Local video stream visible
- ✅ All controls (mute, video, screen share) functional
- ✅ Can send chat messages (local only)
- ✅ End call shows rating modal
- ✅ After rating (or skip), redirects to landing page
- ❌ Won't see other participants from different devices (needs signaling server)

---

## Post-Meeting Rating Feature

### User Flow:
1. User clicks "Leave Meeting" or end call button (red phone icon)
2. All media tracks are stopped
3. Rating modal appears with:
   - 5-star rating system
   - Optional text feedback
   - Skip or Submit buttons
4. On submit/skip, user redirects to landing page (`/`)

### API Endpoint:
```
POST /api/meetings/feedback
Content-Type: application/json

{
  "meetingTitle": "CS101 Lecture",
  "rating": 5,
  "feedback": "Great video quality!",
  "timestamp": "2025-10-25T22:30:00.000Z"
}
```

### Future Enhancements:
- Store feedback in PostgreSQL database
- Show average ratings per course/meeting
- Analytics dashboard for faculty to see meeting quality trends
- Automatic issue reporting for low ratings

---

## Next Steps to Enable Full Functionality

### Immediate (Testing):
1. Set up basic Socket.IO signaling server (Option 1 above)
2. Update `use-websocket.ts` to connect to real server
3. Implement peer-to-peer connection establishment in `use-webrtc.ts`
4. Test with 2+ devices on same network

### Short-term (Production Ready):
1. Choose a signaling service (Agora, Twilio, Daily.co, or Firebase)
2. Search Replit integrations for WebRTC/video services
3. Replace mock data with real participant management
4. Add meeting recording capabilities
5. Store meeting feedback in PostgreSQL

### Long-term (Enterprise Features):
1. Breakout rooms support
2. Virtual backgrounds
3. Meeting recording and playback
4. Live transcription/captions
5. Screen annotation tools
6. Waiting room for meetings
7. Meeting analytics and quality metrics

---

## Firebase + Vercel Integration Possibilities

Your current stack: **Next.js + PostgreSQL (Replit) + JWT Auth**

### Integration Options:

**Option A: Stay on Replit (Recommended)**
- Keep everything as-is on Replit
- Add Firebase SDK for real-time chat and signaling only
- Cost: Free for small usage
- Benefits: Simple, no migration needed

**Option B: Hybrid - Replit DB + Vercel Hosting**
- Deploy Next.js frontend to Vercel (faster edge network)
- Keep PostgreSQL on Replit (or migrate to Vercel Postgres)
- Add Firebase for real-time features
- Cost: $20/mo Vercel Pro
- Benefits: Best performance for frontend

**Option C: Full Firebase Backend**
- Replace PostgreSQL with Firestore (NoSQL)
- Requires rewriting all data models and queries
- Cost: Pay-as-you-go (can get expensive)
- Benefits: Real-time everything, but loses SQL structure

**Recommendation:**
**Stay on Replit with selective Firebase integration** for WebRTC signaling and real-time chat. Your academic data (programs, curriculum, assignments) is perfect for PostgreSQL and works great on Replit.

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │  React Components                                   │ │
│  │  - VideoConferenceLayout                           │ │
│  │  - PostMeetingRating                               │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Hooks                                              │ │
│  │  - useWebRTC (manages media streams)               │ │
│  │  - useWebSocket (handles signaling - NEEDS IMPL)   │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  WebRTC API (Browser Native)                       │ │
│  │  - getUserMedia() - camera/mic access             │ │
│  │  - RTCPeerConnection - peer connections            │ │
│  │  - getDisplayMedia() - screen sharing              │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────┐
        │  Signaling Server (NEEDED)     │
        │  - Socket.IO / WebSocket       │
        │  - Exchange SDP offers/answers │
        │  - Relay ICE candidates        │
        │  - Manage meeting rooms        │
        └────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────┐
│              Peer-to-Peer Connection                     │
│  ┌──────────────┐              ┌──────────────┐         │
│  │  Client A    │ ←──WebRTC──→ │  Client B    │         │
│  │  (Browser)   │              │  (Browser)   │         │
│  └──────────────┘              └──────────────┘         │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
app/
├── meetings/[id]/page.tsx          # Meeting room page
├── guest/page.tsx                   # Guest access entry
├── api/
│   └── meetings/
│       └── feedback/route.ts        # Store meeting ratings

components/
├── video-conference-layout.tsx      # Main meeting UI
└── meeting/
    └── post-meeting-rating.tsx      # Rating modal

hooks/
├── use-webrtc.ts                    # WebRTC media management
└── use-websocket.ts                 # WebSocket signaling (needs backend)

middleware.ts                         # Allows guest access to /meetings/*
```

---

**For questions or implementation help, refer to this documentation or search for Replit integrations for video conferencing services.**
