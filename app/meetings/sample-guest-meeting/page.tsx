"use client";

import { VideoConferenceLayout } from "@/components/video-conference-layout";

export default function SampleGuestMeetingPage() {
  const mockMeeting = {
    id: "sample-guest-meeting",
    name: "Sample Guest Meeting",
    title: "Guest Meeting Demo",
  };

  return (
    <VideoConferenceLayout
      meeting={mockMeeting}
      participantId="guest-123"
      participantName="Guest User"
      isHost={false}
    />
  );
}