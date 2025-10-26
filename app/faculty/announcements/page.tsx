'use client'

import { FacultyHeader } from '@/components/faculty-header'

export default function FacultyAnnouncementsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <FacultyHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Create and manage announcements.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
