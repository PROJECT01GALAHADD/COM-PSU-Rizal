'use client'

import { StudentHeader } from '@/components/student-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotificationsPage() {
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <main className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System notifications will appear here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
