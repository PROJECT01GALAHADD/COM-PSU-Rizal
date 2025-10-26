'use client'

import { StudentHeader } from '@/components/student-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SubjectsPage() {
  const handleLogout = () => {}
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <main className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <p>List of subjects will appear here.</p>
          </CardContent>
        </Card>
      </main>
      <AppverseFooter />
    </div>
  )
}
