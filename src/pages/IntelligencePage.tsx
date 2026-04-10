import { BarChart3 } from "lucide-react";

export default function IntelligencePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-card">
      <div className="text-center p-8">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">Public Intelligence & Reports</h1>
        <p className="text-muted-foreground max-w-md">
          Aggregate statistics, county breakdowns, technology mix analysis, and downloadable reports.
        </p>
      </div>
    </div>
  );
}
