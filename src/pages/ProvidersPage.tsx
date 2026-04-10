import { Factory } from "lucide-react";

export default function ProvidersPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-card">
      <div className="text-center p-8">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Factory className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">Provider Directory</h1>
        <p className="text-muted-foreground max-w-md">
          Vetted suppliers and service providers across all clean cooking categories.
        </p>
      </div>
    </div>
  );
}
