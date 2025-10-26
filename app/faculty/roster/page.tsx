'use client'

import { FacultyHeader } from '@/components/faculty-header'

export default function FacultyRosterPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <FacultyHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Roster</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and manage your class rosters here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
