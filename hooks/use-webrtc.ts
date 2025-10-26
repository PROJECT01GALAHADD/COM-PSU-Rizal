import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isScreenSharing: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
}

export function useWebRTC(meetingId: string, participantId: string): UseWebRTCReturn {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const { toast } = useToast();

  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const screenStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeLocalStream();
    return () => {
      cleanup();
    };
  }, []);

  const initializeLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        title: "Media Access Error",
        description: "Failed to access camera and microphone",
        variant: "destructive",
      });
    }
  };

  const toggleMicrophone = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    } else {
      setIsCameraOff(!isCameraOff);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      try {
        if (screenStream.current) {
          screenStream.current.getTracks().forEach(track => track.stop());
          screenStream.current = null;
        }
        
        await initializeLocalStream();
        setIsScreenSharing(false);
      } catch (error) {
        console.error("Error stopping screen share:", error);
        setIsScreenSharing(false);
      }
    } else {
      setIsScreenSharing(true);
      
      try {
        if (localStream) {
          localStream.getTracks().forEach(track => track.stop());
        }
        
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        screenStream.current = stream;
        setLocalStream(stream);

        stream.getVideoTracks()[0].addEventListener('ended', () => {
          setIsScreenSharing(false);
          initializeLocalStream();
        });
        
        toast({
          title: "Screen Share Started",
          description: "Screen sharing is now active",
        });
      } catch (error) {
        console.error("Error starting screen share:", error);
        toast({
          title: "Screen Share Not Available",
          description: "Screen sharing is not supported in this environment",
          variant: "destructive",
        });
      }
    }
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream.current) {
      screenStream.current.getTracks().forEach(track => track.stop());
    }
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
  };

  return {
    localStream,
    remoteStreams,
    isScreenSharing,
    isMuted,
    isCameraOff,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
  };
}