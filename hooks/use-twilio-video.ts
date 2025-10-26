import { useState, useEffect, useRef, useCallback } from 'react';
import Video, { 
  LocalVideoTrack, 
  LocalAudioTrack, 
  RemoteParticipant,
  RemoteTrack,
  RemoteVideoTrack,
  RemoteAudioTrack,
  RemoteTrackPublication,
  LocalParticipant,
  Room,
  LocalTrackPublication
} from 'twilio-video';
import { useToast } from '@/hooks/use-toast';

interface UseTwilioVideoReturn {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isScreenSharing: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isConnected: boolean;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
  participantCount: number;
}

export function useTwilioVideo(
  meetingId: string,
  participantId: string,
  participantName: string = 'Guest'
): UseTwilioVideoReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const { toast } = useToast();

  const roomRef = useRef<Room | null>(null);
  const localVideoTrackRef = useRef<LocalVideoTrack | null>(null);
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const screenTrackRef = useRef<LocalVideoTrack | null>(null);

  const handleParticipantConnected = useCallback((participant: RemoteParticipant) => {
    console.log(`Participant connected: ${participant.identity}`);
    
    setParticipantCount(prev => prev + 1);

    participant.tracks.forEach((publication: RemoteTrackPublication) => {
      if (publication.isSubscribed && publication.track) {
        attachTrack(participant.sid, publication.track);
      }
    });

    participant.on('trackSubscribed', (track: RemoteTrack) => {
      attachTrack(participant.sid, track);
    });

    participant.on('trackUnsubscribed', (track: RemoteTrack) => {
      detachTrack(participant.sid, track);
    });
  }, []);

  const handleParticipantDisconnected = useCallback((participant: RemoteParticipant) => {
    console.log(`Participant disconnected: ${participant.identity}`);
    
    setParticipantCount(prev => Math.max(0, prev - 1));
    
    setRemoteStreams((prev) => {
      const newMap = new Map(prev);
      newMap.delete(participant.sid);
      return newMap;
    });
  }, []);

  const attachTrack = (participantSid: string, track: RemoteTrack) => {
    if (track.kind === 'video' || track.kind === 'audio') {
      const mediaTrack = track as RemoteVideoTrack | RemoteAudioTrack;
      setRemoteStreams((prev) => {
        const newMap = new Map(prev);
        const existingStream = newMap.get(participantSid);
        
        if (existingStream) {
          existingStream.addTrack(mediaTrack.mediaStreamTrack);
        } else {
          const newStream = new MediaStream([mediaTrack.mediaStreamTrack]);
          newMap.set(participantSid, newStream);
        }
        
        return newMap;
      });
    }
  };

  const detachTrack = (participantSid: string, track: RemoteTrack) => {
    if (track.kind === 'video' || track.kind === 'audio') {
      const mediaTrack = track as RemoteVideoTrack | RemoteAudioTrack;
      setRemoteStreams((prev) => {
        const newMap = new Map(prev);
        const stream = newMap.get(participantSid);
        
        if (stream) {
          stream.removeTrack(mediaTrack.mediaStreamTrack);
          if (stream.getTracks().length === 0) {
            newMap.delete(participantSid);
          }
        }
        
        return newMap;
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    async function connectToRoom() {
      try {
        const response = await fetch('/api/twilio/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identity: participantName,
            roomName: meetingId
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get access token');
        }

        const { token } = await response.json();

        const room = await Video.connect(token, {
          name: meetingId,
          audio: true,
          video: { width: 1280, height: 720 }
        });

        if (!mounted) {
          room.disconnect();
          return;
        }

        roomRef.current = room;
        setIsConnected(true);

        const localParticipant: LocalParticipant = room.localParticipant;
        const stream = new MediaStream();

        localParticipant.videoTracks.forEach((publication: LocalTrackPublication) => {
          if (publication.track) {
            const track = publication.track as LocalVideoTrack;
            localVideoTrackRef.current = track;
            stream.addTrack(track.mediaStreamTrack);
          }
        });

        localParticipant.audioTracks.forEach((publication: LocalTrackPublication) => {
          if (publication.track) {
            const track = publication.track as LocalAudioTrack;
            localAudioTrackRef.current = track;
            stream.addTrack(track.mediaStreamTrack);
          }
        });

        setLocalStream(stream);
        setParticipantCount(room.participants.size);

        room.participants.forEach(handleParticipantConnected);
        room.on('participantConnected', handleParticipantConnected);
        room.on('participantDisconnected', handleParticipantDisconnected);

        room.on('disconnected', () => {
          if (mounted) {
            setIsConnected(false);
            toast({
              title: 'Disconnected',
              description: 'You have been disconnected from the meeting.',
              variant: 'destructive'
            });
          }
        });

        toast({
          title: 'Connected',
          description: 'Successfully joined the video meeting!',
        });

      } catch (error) {
        console.error('Error connecting to Twilio room:', error);
        if (mounted) {
          toast({
            title: 'Connection Failed',
            description: 'Failed to join the video meeting. Please try again.',
            variant: 'destructive'
          });
        }
      }
    }

    connectToRoom();

    return () => {
      mounted = false;
      
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }

      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current = null;
      }

      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current = null;
      }

      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
    };
  }, [meetingId, participantId, participantName, toast, handleParticipantConnected, handleParticipantDisconnected]);

  const toggleMicrophone = useCallback(() => {
    if (localAudioTrackRef.current) {
      if (isMuted) {
        localAudioTrackRef.current.enable();
        setIsMuted(false);
        toast({ title: 'Microphone On', description: 'Your microphone is now unmuted.' });
      } else {
        localAudioTrackRef.current.disable();
        setIsMuted(true);
        toast({ title: 'Microphone Off', description: 'Your microphone is now muted.' });
      }
    }
  }, [isMuted, toast]);

  const toggleCamera = useCallback(() => {
    if (localVideoTrackRef.current) {
      if (isCameraOff) {
        localVideoTrackRef.current.enable();
        setIsCameraOff(false);
        toast({ title: 'Camera On', description: 'Your camera is now enabled.' });
      } else {
        localVideoTrackRef.current.disable();
        setIsCameraOff(true);
        toast({ title: 'Camera Off', description: 'Your camera is now disabled.' });
      }
    }
  }, [isCameraOff, toast]);

  const toggleScreenShare = useCallback(async () => {
    if (!roomRef.current) return;

    try {
      if (isScreenSharing) {
        if (screenTrackRef.current) {
          roomRef.current.localParticipant.unpublishTrack(screenTrackRef.current);
          screenTrackRef.current.stop();
          screenTrackRef.current = null;
          setIsScreenSharing(false);
          
          if (localVideoTrackRef.current) {
            await roomRef.current.localParticipant.publishTrack(localVideoTrackRef.current);
          }

          toast({ title: 'Screen Sharing Stopped', description: 'You stopped sharing your screen.' });
        }
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });

        const screenTrack = stream.getVideoTracks()[0];
        const twilioScreenTrack = new Video.LocalVideoTrack(screenTrack);
        screenTrackRef.current = twilioScreenTrack;

        if (localVideoTrackRef.current) {
          roomRef.current.localParticipant.unpublishTrack(localVideoTrackRef.current);
        }

        await roomRef.current.localParticipant.publishTrack(twilioScreenTrack);
        setIsScreenSharing(true);

        screenTrack.onended = () => {
          toggleScreenShare();
        };

        toast({ title: 'Screen Sharing', description: 'You are now sharing your screen.' });
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      toast({
        title: 'Screen Share Error',
        description: 'Failed to share screen. Please try again.',
        variant: 'destructive'
      });
    }
  }, [isScreenSharing, toast]);

  return {
    localStream,
    remoteStreams,
    isScreenSharing,
    isMuted,
    isCameraOff,
    isConnected,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    participantCount
  };
}
