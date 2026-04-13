import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LifeBuoy } from "lucide-react";

export default function InstitutionSupport() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Support</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <LifeBuoy className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Support Centre</CardTitle>
            <CardDescription>Get help and raise support tickets</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Submit support tickets and track their progress here. Our team will respond within 24 hours.</p>
        </CardContent>
      </Card>
    </div>
  );
}
