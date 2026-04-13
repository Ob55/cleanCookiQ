import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Route } from "lucide-react";

export default function InstitutionPathway() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">My Pathway</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Route className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Transition Pathway</CardTitle>
            <CardDescription>Track your clean cooking transition journey</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your clean cooking transition pathway and milestones will appear here once your assessment is complete.</p>
        </CardContent>
      </Card>
    </div>
  );
}
