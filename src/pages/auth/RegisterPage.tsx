import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Building2, Factory, Banknote, FlaskConical, Landmark, GraduationCap, Briefcase, FolderKanban, Shield, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const orgTypes = [
  { value: "institution", label: "Institution", desc: "School, hospital, prison, factory", icon: Building2 },
  { value: "supplier", label: "Supplier / Provider", desc: "Equipment, installation, maintenance", icon: Factory },
  { value: "funder", label: "Funder / Financing Partner", desc: "Finance partner or investor", icon: Banknote },
  { value: "csr", label: "CSR Partner", desc: "Corporate social responsibility", icon: Landmark },
  { value: "researcher", label: "Researcher", desc: "Academic or research institution", icon: FlaskConical },
];

const roleTypes = [
  { value: "ta_provider", label: "TA Provider", desc: "Provide technical assistance to institutions", icon: GraduationCap, forOrg: "supplier" },
  { value: "financing_partner", label: "Financing Partner", desc: "Review and fund grant/debt applications", icon: Banknote, forOrg: "funder" },
  { value: "programme_manager", label: "Programme Manager", desc: "Manage multi-institution programmes", icon: FolderKanban, forOrg: null },
  { value: "dmrv_verifier", label: "dMRV Verifier", desc: "Submit and verify monitoring records", icon: Shield, forOrg: null },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [orgName, setOrgName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);

    const requestedRole = selectedRole || (orgType === "institution" ? "institution_admin" : undefined);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          org_type: orgType,
          org_name: orgName,
          phone,
          requested_role: requestedRole,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/auth/verify-email");
    }
  };

  const availableRoles = roleTypes.filter(r => !r.forOrg || r.forOrg === orgType);

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
            {step === 1 ? "Select your organisation type" : step === 2 ? "Select your role (optional)" : "Enter your details"}
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
                    orgType === org.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
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
              <Button className="w-full mt-4 bg-primary text-primary-foreground" disabled={!orgType} onClick={() => setStep(2)}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-3">
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
              <p className="text-sm text-muted-foreground mb-3">Select a specialised role if applicable, or skip to continue.</p>
              {availableRoles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(selectedRole === role.value ? "" : role.value)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors text-left ${
                    selectedRole === role.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    selectedRole === role.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <role.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{role.label}</p>
                    <p className="text-xs text-muted-foreground">{role.desc}</p>
                  </div>
                </button>
              ))}
              <Button className="w-full mt-4 bg-primary text-primary-foreground" onClick={() => setStep(3)}>
                {selectedRole ? "Continue" : "Skip & Continue"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
              <div>
                <Label htmlFor="orgName">Organisation Name</Label>
                <Input id="orgName" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Nairobi Primary School" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@organisation.co.ke" className="mt-1" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password" className="mt-1" required />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
