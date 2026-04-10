import { MapPin } from "lucide-react";

export default function MapPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-card">
      <div className="text-center p-8">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">National Transition Map</h1>
        <p className="text-muted-foreground max-w-md">
          Interactive map showing all institutions across Kenya's 47 counties. Coming with Mapbox integration.
        </p>
      </div>
    </div>
  );
}
