'use client'

import { FacultyHeader } from '@/components/faculty-header'

export default function FacultyNotificationsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <FacultyHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p>System notifications for faculty.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
