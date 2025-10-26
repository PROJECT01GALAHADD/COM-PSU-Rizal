import { useState, useEffect, useRef } from "react";

interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
}

interface ChatMessage {
  id: string;
  participantId: string;
  message: string;
  timestamp: string;
  participantName?: string;
}

interface UseWebSocketReturn {
  participants: Participant[];
  chatMessages: ChatMessage[];
  sendMessage: (message: string) => void;
  isConnected: boolean;
}

export function useWebSocket(
  meetingId: string,
  participantId: string,
  participantName: string
): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "You", isHost: true, isMuted: false, isCameraOff: false, isScreenSharing: false },
    { id: "2", name: "Prof. Garcia", isHost: true, isMuted: false, isCameraOff: false, isScreenSharing: false },
    { id: "3", name: "Student A", isHost: false, isMuted: false, isCameraOff: false, isScreenSharing: false },
    { id: "4", name: "Student B", isHost: false, isMuted: false, isCameraOff: false, isScreenSharing: false },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", participantId: "2", message: "Good morning everyone!", timestamp: new Date().toISOString(), participantName: "Prof. Garcia" },
    { id: "2", participantId: "3", message: "Morning Professor!", timestamp: new Date().toISOString(), participantName: "Student A" },
  ]);

  useEffect(() => {
    // Simulate WebSocket connection
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const sendMessage = (message: string) => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        participantId: participantId,
        message: message,
        timestamp: new Date().toISOString(),
        participantName: participantName,
      };
      setChatMessages(prev => [...prev, newMessage]);
    }
  };

  return {
    participants,
    chatMessages,
    sendMessage,
    isConnected,
  };
}