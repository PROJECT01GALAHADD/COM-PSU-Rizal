# Video Conferencing Test Guide
## Test Your Cross-Device Video Calls

---

## 🎯 Quick Test (5 minutes)

### Method 1: Two Browsers on Same Computer

1. **Open Browser 1 (Chrome)**
   - Click "Join Meeting" button on homepage
   - Enter meeting code: `test-meeting-001`
   - Enter your name: `Tester Chrome`
   - Click "Join as Guest"
   - **Allow camera and microphone access when prompted**

2. **Open Browser 2 (Firefox or Edge)**
   - Go to same URL in a private/incognito window
   - Click "Join Meeting"
   - Enter same meeting code: `test-meeting-001`
   - Enter your name: `Tester Firefox`
   - Click "Join as Guest"
   - **Allow camera and microphone access**

3. **What You Should See:**
   - ✅ Your own video in one tile
   - ✅ Other participant's video in another tile
   - ✅ Green "connected" indicator
   - ✅ Participant count shows "2 participants"
   - ✅ Can hear each other (test by speaking)

---

## 📱 Method 2: Computer + Mobile Device

1. **On Computer:**
   - Join meeting code: `mobile-test-123`
   - Name: `Desktop User`

2. **On Phone/Tablet:**
   - Open same website URL
   - Join meeting code: `mobile-test-123`
   - Name: `Mobile User`
   - Grant camera/mic permissions

3. **Test Features:**
   - Mute/unmute microphone
   - Turn camera on/off
   - Screen share (computer only)
   - Chat messages

---

## 🧪 Complete Testing Checklist

### Video & Audio
- [ ] Local video displays correctly
- [ ] Remote participant video appears
- [ ] Can hear remote participant speaking
- [ ] Remote participant can hear you
- [ ] Video quality is acceptable
- [ ] Audio has no significant delay

### Controls
- [ ] Mute button works (mic icon turns red)
- [ ] Unmute restores audio
- [ ] Camera off button works (video icon turns red)
- [ ] Camera on shows video again
- [ ] Screen share button initiates screen sharing
- [ ] Screen share displays to remote participant
- [ ] Stop screen share returns to camera

### Connection
- [ ] Green indicator shows "connected"
- [ ] Participant count is accurate
- [ ] New participants appear automatically
- [ ] Participants who leave disappear from grid
- [ ] Reconnects after brief network interruption

### Chat (WebSocket)
- [ ] Can send chat messages
- [ ] Messages appear for remote participants
- [ ] Chat panel opens/closes correctly
- [ ] Message history persists during meeting

### Performance
- [ ] Page loads within 5 seconds
- [ ] Video starts within 3 seconds
- [ ] No significant lag or freezing
- [ ] Works on mobile browsers
- [ ] Works on different networks (WiFi, cellular)

---

## 🔍 What to Look For

### ✅ Success Indicators
1. **Green dot** in header = Connected to Pusher
2. **Participant count** matches actual participants
3. **Video tiles** show live video feeds
4. **Audio levels** visible when speaking
5. **No console errors** related to WebRTC

### ❌ Common Issues & Solutions

**Issue: "Media Access Error"**
- **Solution**: Grant camera/microphone permissions in browser settings
- Chrome: chrome://settings/content/camera
- Firefox: about:preferences#privacy

**Issue: "Can see self but not others"**
- **Solution**: Check Pusher credentials in environment variables
- Verify: PUSHER_APP_ID, NEXT_PUBLIC_PUSHER_KEY are set correctly
- Check browser console for Pusher connection errors

**Issue: "Connection indicator is red"**
- **Solution**: Check internet connection
- Verify Pusher service is not down: https://status.pusher.com
- Check browser console for errors

**Issue: "Video freezes or lags"**
- **Solution**: Check bandwidth (need at least 1 Mbps)
- Close other applications using camera
- Try different network (WiFi vs. cellular)
- Reduce video quality if needed

**Issue: "Screen share not working"**
- **Solution**: Some browsers don't support screen share
- Chrome/Edge: Full support
- Firefox: Supported
- Safari: Partial support
- Mobile: Usually not supported

---

## 🌐 Browser Compatibility

| Browser | Video | Audio | Screen Share | Mobile |
|---------|-------|-------|--------------|--------|
| Chrome | ✅ Excellent | ✅ Excellent | ✅ Yes | ✅ Yes |
| Firefox | ✅ Excellent | ✅ Excellent | ✅ Yes | ✅ Yes |
| Edge | ✅ Excellent | ✅ Excellent | ✅ Yes | ✅ Yes |
| Safari | ✅ Good | ✅ Good | ⚠️ Partial | ✅ Yes |
| Mobile Chrome | ✅ Good | ✅ Good | ❌ No | ✅ Yes |
| Mobile Safari | ✅ Good | ✅ Good | ❌ No | ✅ Yes |

---

## 📊 Network Requirements

**Minimum:**
- Download: 1 Mbps
- Upload: 1 Mbps
- Latency: < 100ms

**Recommended:**
- Download: 3 Mbps
- Upload: 3 Mbps
- Latency: < 50ms

**For HD Quality:**
- Download: 5+ Mbps
- Upload: 5+ Mbps
- Latency: < 30ms

---

## 🐛 Debugging Tips

### Check Browser Console
1. Press F12 to open Developer Tools
2. Go to "Console" tab
3. Look for errors related to:
   - Pusher connection
   - WebRTC
   - Media devices

### Common Console Messages

**✅ Good:**
```
Connected to meeting: test-meeting-001
Member joined: xyz123
Peer xyz123 connection state: connected
```

**❌ Bad:**
```
Error: Pusher connection failed
WebRTC offer error
ICE candidate error
```

### Check Network Tab
1. F12 → Network tab
2. Filter: WS (WebSockets)
3. Should see connection to Pusher (wss://ws-ap1.pusher.com)
4. Status should be "101 Switching Protocols"

### Check Pusher Dashboard
1. Go to https://dashboard.pusher.com
2. Check "Debug Console"
3. See real-time events:
   - member_added
   - webrtc-offer
   - webrtc-answer
   - ice-candidate

---

## 📝 Test Scenarios

### Scenario 1: Basic 1-on-1 Call
1. User A joins meeting
2. User B joins same meeting
3. Both see each other
4. Both can communicate
5. Either can leave cleanly

### Scenario 2: Group Call (3+ People)
1. User A joins
2. User B joins
3. User C joins
4. All 3 see each other
5. All can communicate
6. B leaves, A and C still connected

### Scenario 3: Network Interruption
1. Users A and B connected
2. User A loses network briefly (toggle WiFi)
3. Connection re-establishes
4. Video/audio resumes

### Scenario 4: Screen Share
1. User A shares screen
2. User B sees shared screen
3. User A can continue speaking
4. User A stops sharing, returns to camera

### Scenario 5: Mobile → Desktop
1. Mobile user joins
2. Desktop user joins
3. Mobile can see desktop video
4. Desktop can see mobile video
5. Both can hear each other

---

## 🎓 Advanced Testing

### Test with 5+ Participants
- Join same meeting from 5 different browsers/devices
- Check if video grid adjusts correctly
- Verify performance doesn't degrade significantly
- Test chat with multiple participants

### Test with Different Networks
- WiFi → WiFi
- WiFi → Cellular
- Cellular → Cellular
- Different ISPs
- VPN → Direct connection

### Test Bandwidth Throttling
1. Open Chrome DevTools (F12)
2. Network tab → Throttling → Slow 3G
3. Join meeting
4. Observe video quality adaptation

---

## 📈 Success Metrics

Your video conferencing is working correctly if:
- ✅ 95%+ successful connections
- ✅ Video starts within 3 seconds
- ✅ Audio delay < 200ms
- ✅ Works on 3+ different browsers
- ✅ Works on mobile devices
- ✅ Screen sharing functional
- ✅ Chat messages delivered

---

## 🚀 Production Testing

Before deploying to production:
1. ✅ Test with real users (not just yourself)
2. ✅ Test on different networks (school, home, cellular)
3. ✅ Test with 10+ concurrent participants
4. ✅ Monitor Pusher usage (stay within free tier)
5. ✅ Check browser console for warnings
6. ✅ Verify no memory leaks (long meetings)
7. ✅ Test on oldest supported browsers

---

## 📞 Support

### If Video Calls Don't Work:

**Check Environment Variables:**
```bash
echo $PUSHER_APP_ID
echo $NEXT_PUBLIC_PUSHER_KEY
echo $NEXT_PUBLIC_PUSHER_CLUSTER
```

**Verify Pusher Credentials:**
- Log in to https://dashboard.pusher.com
- Check app credentials match environment variables
- Verify app is active (not paused)

**Check Server Logs:**
```bash
# In Replit Shell
tail -f /tmp/logs/Next.js_Dev_Server_*.log
```

**Check Browser Console:**
- Look for WebRTC errors
- Look for Pusher connection errors
- Check for CORS issues

---

## ✅ Test Complete Checklist

When you can check all these boxes, your video conferencing is production-ready:

- [ ] Two different browsers can connect
- [ ] Mobile device can connect
- [ ] Can see and hear each other
- [ ] Controls work (mute, camera, screen share)
- [ ] Connection is stable for 5+ minutes
- [ ] 3+ participants work simultaneously
- [ ] Chat messages sync correctly
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Works on different networks

---

**Start Testing Now!**

1. Open this URL in Chrome: [Your Replit App URL]
2. Click "Join Meeting"
3. Meeting code: `test-001`
4. Open Firefox or phone
5. Join same meeting code
6. Start testing!

Good luck! 🎉
