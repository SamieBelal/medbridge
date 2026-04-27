"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, User, Stethoscope, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Role = "patient" | "provider";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, display_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${role === "provider" ? "/onboarding" : "/dashboard"}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Create profile row (trigger was removed for compatibility)
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        role,
        display_name: name,
      });
    }

    // If email confirmation is required
    if (data.user && !data.session) {
      setConfirmEmail(true);
      setLoading(false);
      return;
    }

    router.push(role === "provider" ? "/onboarding" : "/dashboard");
    router.refresh();
  }

  if (confirmEmail) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <Shield className="mx-auto h-10 w-10 text-navy-deep mb-4" />
            <h2 className="text-xl font-semibold text-charcoal mb-2">Check your email</h2>
            <p className="text-sm text-muted-foreground">
              We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <Shield className="mx-auto h-10 w-10 text-navy-deep mb-3" />
          <h1 className="text-2xl font-bold text-charcoal">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join MedBridge — transparent healthcare starts here
          </p>
        </CardHeader>
        <CardContent>
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                role === "patient"
                  ? "border-navy-deep bg-navy-deep/5"
                  : "border-border hover:border-navy-deep/30"
              )}
            >
              <User className={cn("h-6 w-6", role === "patient" ? "text-navy-deep" : "text-muted-foreground")} />
              <span className={cn("text-sm font-medium", role === "patient" ? "text-navy-deep" : "text-muted-foreground")}>
                I&apos;m a Patient
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("provider")}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                role === "provider"
                  ? "border-navy-deep bg-navy-deep/5"
                  : "border-border hover:border-navy-deep/30"
              )}
            >
              <Stethoscope className={cn("h-6 w-6", role === "provider" ? "text-navy-deep" : "text-muted-foreground")} />
              <span className={cn("text-sm font-medium", role === "provider" ? "text-navy-deep" : "text-muted-foreground")}>
                I&apos;m a Provider
              </span>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{role === "provider" ? "Full Name (as licensed)" : "Display Name"}</Label>
              <Input
                id="name"
                type="text"
                placeholder={role === "provider" ? "Dr. Jane Smith" : "Jane"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <p className="text-sm text-danger">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-navy-deep hover:bg-navy-light text-white"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {role === "provider" ? "Create Provider Account" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-navy-deep hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
