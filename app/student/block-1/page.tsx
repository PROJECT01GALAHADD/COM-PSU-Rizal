'use client'

import { StudentHeader } from '@/components/student-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Block1Page() {
  return (
    <div className="min-h-screen">
      <StudentHeader />
      <main className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Block 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Block 1 schedule and info.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
