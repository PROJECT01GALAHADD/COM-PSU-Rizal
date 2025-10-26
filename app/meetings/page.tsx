"use client"

import { VideoConferenceLayout } from "@/components/video-conference-layout"

export default function MeetingPage() {
  const mockMeeting = {
    id: "123",
    name: "History 101 - Lecture 5",
    title: "History 101 - Lecture 5",
  }

  return (
    <VideoConferenceLayout
      meeting={mockMeeting}
      participantId="456"
      participantName="You"
      isHost={true}
    />
  )
}
