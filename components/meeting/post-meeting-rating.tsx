'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PostMeetingRatingProps {
  isOpen: boolean
  meetingTitle: string
  onClose?: () => void
}

export function PostMeetingRating({ isOpen, meetingTitle, onClose }: PostMeetingRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/meetings/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingTitle,
          rating,
          feedback,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: 'Thank you for your feedback!',
          description: 'Your rating helps us improve the platform.',
        })
      }
    } catch (error) {
      console.log('Feedback submission error (non-critical):', error)
    } finally {
      setIsSubmitting(false)
      router.push('/')
      if (onClose) onClose()
    }
  }

  const handleSkip = () => {
    router.push('/')
    if (onClose) onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 border-gray-800 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            How was your meeting?
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Your feedback helps us improve the PSU Rizal platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">
              Rate your experience
            </Label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-400">
                {rating === 5 && 'Excellent!'}
                {rating === 4 && 'Great experience'}
                {rating === 3 && 'Good'}
                {rating === 2 && 'Could be better'}
                {rating === 1 && 'Needs improvement'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-sm font-medium text-gray-300">
              Additional feedback (optional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            Skip
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
