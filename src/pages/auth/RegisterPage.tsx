import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Building2, Factory, Banknote, FlaskConical, Landmark, ArrowRight, ArrowLeft } from "lucide-react";

const orgTypes = [
  { value: "institution", label: "Institution", desc: "School, hospital, prison, factory", icon: Building2 },
  { value: "supplier", label: "Supplier / Provider", desc: "Equipment, installation, maintenance", icon: Factory },
  { value: "funder", label: "Funder", desc: "Finance partner or investor", icon: Banknote },
  { value: "csr", label: "CSR Partner", desc: "Corporate social responsibility", icon: Landmark },
  { value: "researcher", label: "Researcher", desc: "Academic or research institution", icon: FlaskConical },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">C</span>
            </div>
            <span className="font-display font-bold text-xl">
              CleanCook<span className="text-accent">IQ</span>
            </span>
          </Link>
          <h1 className="text-2xl font-display font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 1 ? "Select your organisation type" : "Enter your details"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          {step === 1 ? (
            <div className="space-y-3">
              {orgTypes.map((org) => (
                <button
                  key={org.value}
                  onClick={() => setOrgType(org.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors text-left ${
                    orgType === org.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    orgType === org.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <org.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{org.label}</p>
                    <p className="text-xs text-muted-foreground">{org.desc}</p>
                  </div>
                </button>
              ))}
              <Button
                className="w-full mt-4 bg-primary text-primary-foreground"
                disabled={!orgType}
                onClick={() => setStep(2)}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate("/auth/verify-email"); }}>
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
              <div>
                <Label htmlFor="orgName">Organisation Name</Label>
                <Input id="orgName" placeholder="e.g. Nairobi Primary School" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Your full name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@organisation.co.ke" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" placeholder="+254 7XX XXX XXX" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Create a strong password" className="mt-1" />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground">
                Create Account
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
