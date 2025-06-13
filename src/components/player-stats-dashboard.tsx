
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PlayerStatsDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Batting Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.300</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Home Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>RBI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
