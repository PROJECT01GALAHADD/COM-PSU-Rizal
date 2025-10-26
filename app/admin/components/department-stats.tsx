'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats } from '@/utils/mock-data'

export function DepartmentStats() {
  const stats = getDashboardStats()

  return (
    <Card className="col-span-4 md:col-span-1 bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Departments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {stats.departmentStats.map((dept, index) => (
            <div key={index} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none text-white">
                  {dept.name}
                </p>
                <p className="text-sm text-orange-400">
                  {dept.students} students · {dept.faculty} faculty
                </p>
              </div>
              <div className="ml-auto font-medium text-orange-400">
                {((dept.students / stats.totalStudents) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}