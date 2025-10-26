'use client'

import { StudentHeader } from '@/components/student-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <main className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Edit your profile details here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
