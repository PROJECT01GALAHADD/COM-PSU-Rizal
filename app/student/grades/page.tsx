'use client'

import { StudentHeader } from '@/components/student-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function GradesPage() {
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <main className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your grades will appear here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
