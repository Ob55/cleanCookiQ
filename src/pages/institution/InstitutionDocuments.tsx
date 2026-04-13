import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function InstitutionDocuments() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Documents</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>My Documents</CardTitle>
            <CardDescription>View and upload institution documents</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Your uploaded documents, assessments, and reports will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
