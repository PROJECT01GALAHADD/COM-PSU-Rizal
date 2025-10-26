import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardContent() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to your academic collaboration platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-black/30 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-400">5</p>
            <p className="text-gray-400">Active courses</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-400">12</p>
            <p className="text-gray-400">Pending submissions</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-400">3</p>
            <p className="text-gray-400">Upcoming sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/30 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-orange-500 rounded-full w-2 h-2 mt-2" />
                <div>
                  <p className="text-white">Submitted assignment for CS 101</p>
                  <p className="text-gray-400 text-sm">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-500 rounded-full w-2 h-2 mt-2" />
                <div>
                  <p className="text-white">New announcement in Math 201</p>
                  <p className="text-gray-400 text-sm">5 hours ago</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-full w-2 h-2 mt-2" />
                <div>
                  <p className="text-white">Meeting scheduled for Physics 301</p>
                  <p className="text-gray-400 text-sm">Yesterday</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="bg-orange-500 rounded-lg w-10 h-10 flex items-center justify-center">
                  <span className="text-white text-xs">Oct</span>
                  <span className="text-white font-bold">10</span>
                </div>
                <div>
                  <p className="text-white">CS 101 Midterm Exam</p>
                  <p className="text-gray-400 text-sm">10:00 AM - 12:00 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-green-500 rounded-lg w-10 h-10 flex items-center justify-center">
                  <span className="text-white text-xs">Oct</span>
                  <span className="text-white font-bold">15</span>
                </div>
                <div>
                  <p className="text-white">Group Project Meeting</p>
                  <p className="text-gray-400 text-sm">2:00 PM - 3:30 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-blue-500 rounded-lg w-10 h-10 flex items-center justify-center">
                  <span className="text-white text-xs">Oct</span>
                  <span className="text-white font-bold">20</span>
                </div>
                <div>
                  <p className="text-white">Research Paper Submission</p>
                  <p className="text-gray-400 text-sm">5:00 PM</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}