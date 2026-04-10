import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send a reset link</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@organisation.co.ke" className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground">
              Send Reset Link
            </Button>
          </form>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/auth/login" className="text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
