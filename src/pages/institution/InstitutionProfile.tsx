import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function InstitutionProfile() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">My Institution</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Institution Profile</CardTitle>
            <CardDescription>View and update your institution details</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your institution profile management will appear here. You can update contact details, add staff information, and manage your institution's data.</p>
        </CardContent>
      </Card>
    </div>
  );
}
