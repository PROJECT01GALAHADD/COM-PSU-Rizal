'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats } from '@/utils/mock-data'
import { formatDistanceToNow } from 'date-fns'

export function RecentActivity() {
  const stats = getDashboardStats()

  return (
    <Card className="col-span-4 md:col-span-3 bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {stats.recentActivities.map((activity) => {
            const getIcon = (type: string) => {
              switch (type) {
                case 'enrollment':
                  return '👤'
                case 'grade':
                  return '📊'
                case 'announcement':
                  return '📢'
                case 'assignment':
                  return '📝'
                default:
                  return '📌'
              }
            }

            return (
              <div key={activity.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-white">
                    {getIcon(activity.type)} {activity.description}
                  </p>
                  <p className="text-sm text-orange-400">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}