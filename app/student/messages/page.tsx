'use client'

import { StudentHeader } from '@/components/student-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function MessagesPage() {
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <main className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Chat with instructors and peers.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
