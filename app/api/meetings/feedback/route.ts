import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { meetingTitle, rating, feedback, timestamp } = body

    console.log('Meeting Feedback Received:', {
      meetingTitle,
      rating,
      feedback,
      timestamp,
    })

    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully',
    })
  } catch (error) {
    console.error('Error saving meeting feedback:', error)
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    )
  }
}
