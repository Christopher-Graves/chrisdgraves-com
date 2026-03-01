'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Welcome to your personal command center</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cozmos Status</CardTitle>
            <Badge variant="default" className="bg-emerald-600">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Production</div>
            <p className="text-xs text-muted-foreground">Mainnet testing in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YouTube Channel</CardTitle>
            <Badge variant="secondary">Building</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Week 7/12</div>
            <p className="text-xs text-muted-foreground">Channel Jump Start course</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">2026 Goal Progress</CardTitle>
            <Badge variant="default">On Track</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Q1 2026</div>
            <p className="text-xs text-muted-foreground">500 creators | 100k subs goal</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Notes */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="border-l-2 border-burnt pl-4">
                <p className="font-medium text-cream">Cozmos Launch Week</p>
                <p className="text-muted-foreground">Onboarding first creators, mainnet testing by Sunday</p>
              </div>
              <div className="border-l-2 border-burnt pl-4">
                <p className="font-medium text-cream">YouTube Content</p>
                <p className="text-muted-foreground">Shooting starts next week - cinematic, authentic, conversational</p>
              </div>
              <div className="border-l-2 border-burnt pl-4">
                <p className="font-medium text-cream">Vision: Financial Freedom</p>
                <p className="text-muted-foreground">$15-20k/month from ventures → quit day job, full-time creator</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
