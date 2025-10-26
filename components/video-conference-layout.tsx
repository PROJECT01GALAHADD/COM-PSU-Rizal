import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Phone,
  ScreenShare,
  Settings,
  Clock,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react'
import { useTwilioVideo } from '@/hooks/use-twilio-video'
import { useWebSocket } from '@/hooks/use-websocket'
import { useToast } from '@/hooks/use-toast'
import { PostMeetingRating } from '@/components/meeting/post-meeting-rating'
import Image from "next/image"

interface MeetingProps {
  meeting: {
    id: string
    name: string
    title: string
  }
  participantId: string
  participantName: string
  isHost: boolean
}

export function VideoConferenceLayout({
  meeting,
  participantId,
  participantName,
  isHost,
}: MeetingProps) {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [meetingDuration, setMeetingDuration] = useState('00:00')
  const [newMessage, setNewMessage] = useState('')
  const [showRatingModal, setShowRatingModal] = useState(false)
  const { toast } = useToast()

  // Initialize Twilio Video
  const {
    localStream,
    remoteStreams,
    isScreenSharing,
    isMuted,
    isCameraOff,
    isConnected: webrtcConnected,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    participantCount: twilioParticipantCount
  } = useTwilioVideo(meeting.id, participantId, participantName)

  const { participants, chatMessages, sendMessage, isConnected } = useWebSocket(
    meeting.id,
    participantId,
    participantName
  )

  // Combine WebRTC and WebSocket connection status
  const connectionStatus = webrtcConnected || isConnected

  const localVideoRef = useRef<HTMLVideoElement | null>(null)

  // Attach local media stream to the video element and attempt to play
  useEffect(() => {
    const el = localVideoRef.current
    if (!el) return
    if (localStream) {
      try {
        // Assign MediaStream to the video element
        ;(el as any).srcObject = localStream
        const playPromise = el.play()
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch((err: any) => {
            // Autoplay might be blocked; show UI message if needed
            console.warn('Autoplay blocked or play() failed:', err)
          })
        }
      } catch (err) {
        console.error('Failed to attach local stream to video element', err)
      }
    } else {
      // Clear srcObject when stream is removed
      try {
        ;(el as any).srcObject = null
      } catch {}
    }
  }, [localStream])

  // Update meeting duration
  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const minutes = Math.floor(elapsed / 60)
      const seconds = elapsed % 60
      setMeetingDuration(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage('')
    }
  }

  const handleLeaveMeeting = () => {
    console.log('Leaving meeting...')
    
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    
    // Show rating modal
    setShowRatingModal(true)
  }

  const handleInviteParticipants = () => {
    setIsInviteModalOpen(true)
  }

  const handleCopyLink = async () => {
    try {
      const meetingLink =
        typeof window !== 'undefined'
          ? `${window.location.origin}/meetings/${meeting.id}?name=Guest&guest=true`
          : ''
      if (typeof navigator !== 'undefined' && (navigator as any).clipboard) {
        await (navigator as any).clipboard.writeText(meetingLink)
        setIsCopied(true)
        toast({
          title: 'Link Copied',
          description: 'Meeting link copied to clipboard',
        })
        setTimeout(() => setIsCopied(false), 2000)
      } else if (typeof document !== 'undefined') {
        // Fallback for browsers that don't support clipboard API
        const textArea = (document as any).createElement('textarea')
        textArea.value = meetingLink
        ;(document as any).body.appendChild(textArea)
        textArea.select()
        ;(document as any).execCommand('copy')
        ;(document as any).body.removeChild(textArea)
        setIsCopied(true)
        toast({
          title: 'Link Copied',
          description: 'Meeting link copied to clipboard',
        })
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="dark h-screen flex flex-col overflow-hidden bg-gray-900 meeting-bg">
      {/* Header Bar */}
      <header className="meeting-header bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        {/* Center logo overlay (non-interactive) */}
        <div className="meeting-header-logo">
            <Image
            src="/icons/PSU-logo.svg"
            alt="PSU Rizal"
            width={0}
            height={0}
            sizes="100vw"
            style={{ height: 32, width: "auto" }}
            priority
            />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">
              {meeting.title || meeting.name}
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{meetingDuration}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-muted px-3 py-1 rounded-full">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${connectionStatus ? 'bg-green-500' : 'bg-red-500'}`}
            ></div>
            <span className="text-sm">{participants.length} participants</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>

          {isHost && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleInviteParticipants}
              className="border-white/20 border text-white hover:bg-white/10"
            >
              Invite
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleLeaveMeeting}>
            Leave Meeting
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 bg-gray-900">
          <div className="meeting-grid">
            {/* Local Video */}
            <div className="video-tile">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-70"></div>
              {localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="relative z-10 text-center">
                  <div className="placeholder-avatar mx-auto mb-2 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-white font-medium">{participantName}</p>
                  {isCameraOff && (
                    <p className="text-xs text-gray-400 mt-1">Camera Off</p>
                  )}
                </div>
              )}
              <div className="tile-badge">You {isMuted && '(Muted)'}</div>
            </div>

            {/* Remote Participants */}
            {participants.slice(1).map((participant, index) => (
              <div key={participant.id} className="video-tile">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-70"></div>
                <div className="relative z-10 text-center">
                  <div className="placeholder-avatar mx-auto mb-2 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-white font-medium truncate px-2">
                    {participant.name}
                  </p>
                  {participant.isCameraOff && (
                    <p className="text-xs text-gray-400 mt-1">Camera Off</p>
                  )}
                </div>
                <div className="tile-badge">
                  {participant.isHost && (
                    <span className="text-orange-400 mr-1">●</span>
                  )}
                  {participant.isMuted && 'Muted'}
                </div>
              </div>
            ))}

            {/* Empty slots for grid consistency */}
            {Array.from({
              length: Math.max(0, 6 - participants.length - 1),
            }).map((_, index) => (
              <div key={`empty-${index}`} className="video-tile">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-70"></div>
                <div className="relative z-10 text-center">
                  <div className="placeholder-avatar mx-auto mb-2 flex items-center justify-center">
                    <Video className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Waiting for participant...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        {isSidePanelOpen && (
          <div className="w-80 border-l border-border bg-card flex flex-col">
            {/* Participants Tab */}
            <div className="border-b border-border">
              <Card className="border-0 bg-transparent">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Participants ({participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {participants.map(participant => (
                      <li
                        key={participant.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted"
                      >
                        <div className="bg-gray-700 w-8 h-8 rounded-full" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{participant.name}</p>
                          {participant.isHost && (
                            <span className="text-xs text-orange-400">
                              Host
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {participant.isMuted && (
                            <MicOff className="h-4 w-4 text-red-500" />
                          )}
                          {participant.isCameraOff && (
                            <VideoOff className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Chat Tab */}
            <div className="flex-1 flex flex-col">
              <Card className="border-0 bg-transparent flex-1 flex flex-col">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex-1 mb-4 overflow-y-auto max-h-60">
                    {chatMessages.length > 0 ? (
                      <ul className="space-y-3">
                        {chatMessages.map(msg => (
                          <li key={msg.id} className="text-sm">
                            <p className="font-medium text-primary">
                              {msg.participantName || 'Unknown'}
                            </p>
                            <p className="text-muted-foreground">
                              {msg.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No messages yet
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 meeting-controls flex gap-3">
        <Button
          size="icon"
          variant={isMuted ? 'destructive' : 'secondary'}
          onClick={toggleMicrophone}
          className="rounded-full"
        >
          {isMuted ? (
            <MicOff className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        <Button
          size="icon"
          variant={isCameraOff ? 'destructive' : 'secondary'}
          onClick={toggleCamera}
          className="rounded-full"
        >
          {isCameraOff ? (
            <VideoOff className="h-5 w-5" />
          ) : (
            <Video className="h-5 w-5" />
          )}
        </Button>
        <Button
          size="icon"
          variant={isScreenSharing ? 'secondary' : 'default'}
          onClick={toggleScreenShare}
          className="rounded-full"
        >
          <ScreenShare className="h-5 w-5" />
        </Button>
        {isHost && (
          <Button
            size="icon"
            variant="destructive"
            className="rounded-full"
            onClick={handleLeaveMeeting}
          >
            <Phone className="h-5 w-5 rotate-45" />
          </Button>
        )}
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
        {isHost && (
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={handleInviteParticipants}
          >
            <Users className="h-5 w-5" />
          </Button>
        )}
      </div>

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        meetingId={meeting.id}
      />

      <PostMeetingRating
        isOpen={showRatingModal}
        meetingTitle={meeting.title}
        onClose={() => setShowRatingModal(false)}
      />
    </div>
  )
}

// Add the InviteModal component at the end of the file
function InviteModal({
  isOpen,
  onClose,
  meetingId,
}: {
  isOpen: boolean
  onClose: () => void
  meetingId: string
}) {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)

  const meetingLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/meetings/${meetingId}?name=Guest`
      : ''

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && (navigator as any).clipboard) {
        await (navigator as any).clipboard.writeText(meetingLink)
        setIsCopied(true)
        toast({
          title: 'Link Copied',
          description: 'Meeting link copied to clipboard',
        })
        setTimeout(() => setIsCopied(false), 2000)
      } else if (typeof document !== 'undefined') {
        // Fallback for browsers that don't support clipboard API
        const textArea = (document as any).createElement('textarea')
        textArea.value = meetingLink
        ;(document as any).body.appendChild(textArea)
        textArea.select()
        ;(document as any).execCommand('copy')
        ;(document as any).body.removeChild(textArea)
        setIsCopied(true)
        toast({
          title: 'Link Copied',
          description: 'Meeting link copied to clipboard',
        })
        setTimeout(() => setIsCopied(false), 2000)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/80 backdrop-blur-xl border-white/10 border text-white">
        <DialogHeader>
          <DialogTitle>Invite Participants</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="meeting-link" className="text-sm font-medium">
              Meeting Link
            </Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="meeting-link"
                readOnly
                value={meetingLink}
                className="flex-1 bg-white/10 border-white/20 border text-white"
                onClick={e => (e.target as any).select()}
              />
              <Button
                size="sm"
                onClick={handleCopyLink}
                className="bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-400 hover:to-orange-300"
              >
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-400 hover:to-orange-300"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
