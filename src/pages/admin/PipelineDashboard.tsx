import { TrendingUp, Building2, Factory, BarChart3, Users, FileText } from "lucide-react";

const kpis = [
  { label: "Total Institutions", value: "2,847", change: "+12%", icon: Building2 },
  { label: "Assessed This Month", value: "47", change: "+8%", icon: BarChart3 },
  { label: "In Active Delivery", value: "89", change: "+23%", icon: TrendingUp },
  { label: "Pipeline Value (KSh)", value: "4.2B", change: "+15%", icon: FileText },
  { label: "Revenue Earned (KSh)", value: "18.3M", change: "+31%", icon: TrendingUp },
  { label: "Providers Active", value: "156", change: "+5%", icon: Factory },
];

const pipelineStages = [
  { stage: "Identified", count: 1200, pct: 42 },
  { stage: "Contacted", count: 680, pct: 24 },
  { stage: "Assessed", count: 520, pct: 18 },
  { stage: "Scored", count: 280, pct: 10 },
  { stage: "Opportunity", count: 112, pct: 4 },
  { stage: "In Delivery", count: 89, pct: 3 },
  { stage: "Completed", count: 34, pct: 1 },
];

export default function PipelineDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Pipeline Dashboard</h1>
        <p className="text-sm text-muted-foreground">CEO view — real-time national transition pipeline</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-primary">{kpi.change}</span>
            </div>
            <p className="text-xl font-display font-bold">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <h2 className="font-display font-bold text-lg mb-6">Pipeline Stage Funnel</h2>
        <div className="space-y-3">
          {pipelineStages.map((s) => (
            <div key={s.stage} className="flex items-center gap-4">
              <span className="text-sm font-medium w-28 shrink-0">{s.stage}</span>
              <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full flex items-center justify-end pr-3 transition-all"
                  style={{ width: `${Math.max(s.pct * 2, 8)}%` }}
                >
                  <span className="text-xs font-bold text-primary-foreground">{s.count}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stall Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="font-display font-bold text-lg mb-4">Stall Detection</h2>
          <div className="space-y-3">
            {[
              { name: "Mombasa General Hospital", days: 45, rep: "Sarah K." },
              { name: "Kisumu Boys High School", days: 38, rep: "James O." },
              { name: "Nakuru Prison", days: 32, rep: "Mary W." },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Assigned: {item.rep}</p>
                </div>
                <span className="text-xs font-bold text-destructive">{item.days} days stalled</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="font-display font-bold text-lg mb-4">Revenue Position</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Earned Fees to Date</span>
              <span className="font-display font-bold">KSh 18.3M</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pipeline Fees (if completed)</span>
              <span className="font-display font-bold">KSh 42.7M</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Subscribers</span>
              <span className="font-display font-bold">234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monthly Recurring Revenue</span>
              <span className="font-display font-bold">KSh 1.2M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
