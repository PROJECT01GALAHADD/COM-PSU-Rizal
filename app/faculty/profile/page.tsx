'use client'

import { FacultyHeader } from '@/components/faculty-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <FacultyHeader />
      <main className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Edit your faculty profile here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
