"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateMeetingPage() {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateMeeting = () => {
    if (!meetingTitle.trim() || !participantName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide meeting title and your name",
        variant: "destructive",
      });
      return;
    }

    // Generate a random meeting ID
    const newMeetingId = Math.random().toString(36).substring(2, 10);
    
    // In a real implementation, this would call an API to create the meeting
    // For now, we'll simulate it
    toast({
      title: "Meeting Created",
      description: `Meeting ID: ${newMeetingId}`,
    });
    
    // Redirect to the meeting page
    router.push(`/meetings/${newMeetingId}?host=true&name=${encodeURIComponent(participantName)}`);
  };

  const handleJoinMeeting = () => {
    if (!meetingId.trim() || !participantName.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please provide meeting ID and your name",
        variant: "destructive",
      });
      return;
    }

    router.push(`/meetings/${meetingId}?name=${encodeURIComponent(participantName)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">Video Conferencing</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Create a new meeting or join an existing one. Connect with your classmates and faculty seamlessly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Meeting */}
          <Card className="bg-black/30 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Video className="w-5 h-5 text-orange-400" />
                <span>Start a Meeting</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Meeting Title</label>
                <Input
                  placeholder="Enter meeting title"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle((e.target as HTMLInputElement).value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Your Name</label>
                <Input
                  placeholder="Enter your name"
                  value={participantName}
                  onChange={(e) => setParticipantName((e.target as HTMLInputElement).value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Button 
                onClick={handleCreateMeeting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-400 hover:to-orange-300"
              >
                Create Meeting
              </Button>
            </CardContent>
          </Card>

          {/* Join Meeting */}
          <Card className="bg-black/30 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Users className="w-5 h-5 text-orange-400" />
                <span>Join a Meeting</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Meeting ID</label>
                <Input
                  placeholder="Enter meeting ID"
                  value={meetingId}
                  onChange={(e) => setMeetingId((e.target as HTMLInputElement).value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Your Name</label>
                <Input
                  placeholder="Enter your name"
                  value={participantName}
                  onChange={(e) => setParticipantName((e.target as HTMLInputElement).value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <Button 
                onClick={handleJoinMeeting}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Join Meeting
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>By using this service, you agree to our Acceptable Use Policy</p>
        </div>
      </div>
    </div>
  );
}
