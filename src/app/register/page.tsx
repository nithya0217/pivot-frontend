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
import { KeyRound, Mail, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
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
      // 🚀 Make the live API call to your backend via the Next.js rewrite rule
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          is_author: isAuthor // Matches snake_case backend schemas
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Registration failed on server");
      }

      const newUserData = await response.json();
      
      // Update your local auth state context with the returned data from the backend
      register(newUserData.email, newUserData.is_author ?? isAuthor);
      
      toast.success("Account Created!", {
        description: `Registered successfully as ${email}. ${isAuthor ? "Author status activated." : ""}`,
      });
      
      router.push("/feed");
    } catch (err: any) {
      console.error("Network registration error:", err);
      toast.error("Registration Failed", {
        description: err.message || "An error occurred while creating your account. Try again.",
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
              Create an account
            </CardTitle>
            <CardDescription className="text-muted-foreground font-light">
              Join the Pivot Publishing community and unlock your custom curation feed.
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
                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Password
                </Label>
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

              {/* Author Toggle Checkbox */}
              <div className="flex items-start space-x-3 p-3 bg-violet-50/50 dark:bg-violet-950/10 border border-violet-100 dark:border-violet-900/40 rounded-xl mt-2 transition-all duration-200">
                <input
                  id="isAuthor"
                  type="checkbox"
                  checked={isAuthor}
                  onChange={(e) => setIsAuthor(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-violet-600 focus:ring-violet-500 accent-violet-600 cursor-pointer"
                />
                <div className="space-y-1 cursor-pointer" onClick={() => setIsAuthor(!isAuthor)}>
                  <Label htmlFor="isAuthor" className="text-sm font-semibold text-foreground cursor-pointer">
                    Register as an Author
                  </Label>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Unlocks permission to submit articles and tag content in the author subsystems portal.
                  </p>
                </div>
              </div>

            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-semibold shadow-md hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.99] transition-all duration-200"
              >
                {loading ? "Creating Account..." : "Sign Up"}
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
