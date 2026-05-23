"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please provide a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Determine if they are mock author
      const isAuthor = email.toLowerCase().includes("author");
      login(email, isAuthor);
      
      toast.success("Welcome back to Pivot!", {
        description: `Successfully signed in as ${email}`,
      });
      router.push("/feed");
    } catch (err) {
      toast.error("Authentication Failed", {
        description: "Verify login credentials and server database connection.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-radial from-violet-50/50 via-background to-background dark:from-violet-950/10">
      <div className="w-full max-w-md">
        
        {/* Decorative background glow */}
        <div className="absolute -z-10 w-72 h-72 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="absolute -z-10 w-72 h-72 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl -translate-x-20 translate-y-20 pointer-events-none" />

        <Card className="border border-border/80 shadow-2xl bg-card/75 backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-2 text-center pt-8">
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Welcome back
            </CardTitle>
            <CardDescription className="text-muted-foreground font-light">
              Enter your credentials to access your personalized discovery feed.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-8 pb-6">
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 h-11 bg-background/50 border-border/80 focus-visible:ring-violet-500 focus-visible:border-violet-500 ${
                      errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Password
                  </Label>
                  <Link href="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 h-11 bg-background/50 border-border/80 focus-visible:ring-violet-500 focus-visible:border-violet-500 ${
                      errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium pl-1 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Hint Note */}
              <div className="text-[10px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40">
                <span className="font-bold text-violet-600 dark:text-violet-400">💡 Pro-Tip:</span> Use an email containing <span className="font-semibold text-foreground">"author"</span> (e.g., <code className="font-bold text-foreground">author@pivot.com</code>) to automatically unlock mock author publishing permissions!
              </div>

            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-semibold shadow-md hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.99] transition-all duration-200"
              >
                {loading ? "Signing In..." : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
