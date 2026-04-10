export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground">This module will be built in the next iteration.</p>
      </div>
    </div>
  );
}
