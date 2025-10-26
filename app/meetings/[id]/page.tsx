"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoConferenceLayout } from "@/components/video-conference-layout";
import { useToast } from "@/hooks/use-toast";

export default function MeetingPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [participantId, setParticipantId] = useState<string | null>(null);
  
  const isHost = searchParams?.get('host') === 'true';
  const participantName = searchParams?.get('name') || 'Anonymous';
  const isGuest = searchParams?.get('guest') === 'true';
  
  const mockMeeting = {
    id: params.id,
    name: `Meeting ${params.id.substring(0, 8)}`,
    title: searchParams?.get('title') || `Meeting ${params.id.substring(0, 8)}`,
  };

  useEffect(() => {
    // Generate a participant ID
    const newParticipantId = `${params.id}-${Date.now()}`;
    setParticipantId(newParticipantId);
    
    // Show welcome message
    toast({
      title: "Welcome to the meeting!",
      description: `You are joining as ${participantName || 'Anonymous'}${isHost ? ' (Host)' : ''}`,
    });
  }, [params.id, participantName, isHost]);

  if (!participantId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Joining Meeting...</h1>
          <p className="text-gray-400">Please wait while we connect you to the meeting</p>
        </div>
      </div>
    );
  }

  return (
    <VideoConferenceLayout 
      meeting={mockMeeting}
      participantId={participantId}
      participantName={participantName}
      isHost={isHost}
    />
  );
}
