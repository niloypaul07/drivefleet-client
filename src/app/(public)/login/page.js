'use client';

import { Button, Link, Divider } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, CarFront, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password
      });

      if (error) {
        setErrorMsg(error.message || "Invalid credentials. Please check your email and password.");
        toast.error(error.message || "Invalid credentials. Please try again.");
      } else {
        toast.success("Welcome back to DriveFleet!");
        router.push("/");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMsg("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: typeof window !== "undefined" ? window.location.origin + "/" : "http://localhost:3000/", // redirect to home after login
      });
    } catch (err) {
      setErrorMsg("Google sign in failed. Please try again.");
      toast.error("Google sign in failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center py-16 px-4 overflow-hidden bg-background">
      {/* Dynamic Background Auras */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6s]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8s]" />

      <div className="relative max-w-md w-full bg-content1/40 backdrop-blur-xl border border-divider/60 p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <CarFront className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-sm text-default-500 max-w-xs mx-auto">
            Log in to access your premium rental fleet, active bookings, and personalized dashboard.
          </p>
        </div>

        {/* Premium Inline Error Card */}
        {errorMsg && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-danger">Authentication Error</p>
              <p className="text-xs text-danger/80 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-5">
            {/* Email Field Row */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-default-700 tracking-wide">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-default-400 pointer-events-none z-20" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setErrorMsg("");
                    setEmail(e.target.value);
                  }}
                  className="w-full h-12 pl-12 pr-4 bg-default-100/50 hover:bg-default-100/80 focus:bg-default-100/80 border border-divider hover:border-primary/50 focus:border-primary rounded-2xl outline-none text-foreground text-sm font-medium transition-all duration-200 z-10"
                />
              </div>
            </div>

            {/* Password Field Row */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-default-700 tracking-wide">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 w-5 h-5 text-default-400 pointer-events-none z-20" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setErrorMsg("");
                    setPassword(e.target.value);
                  }}
                  className="w-full h-12 pl-12 pr-4 bg-default-100/50 hover:bg-default-100/80 focus:bg-default-100/80 border border-divider hover:border-primary/50 focus:border-primary rounded-2xl outline-none text-foreground text-sm font-medium transition-all duration-200 z-10"
                />
              </div>
            </div>
          </div>

          <Button 
            color="primary" 
            className="w-full font-bold shadow-lg shadow-primary/20 h-12 text-medium" 
            type="submit" 
            isLoading={isLoading}
            endContent={!isLoading && <ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>

          <div className="relative my-6 flex items-center justify-center">
            <Divider className="absolute w-full bg-divider/40" />
            <span className="relative px-3 bg-background text-xs uppercase tracking-wider text-default-400 font-semibold z-10">
              Or continue with
            </span>
          </div>

          <Button 
            variant="bordered" 
            className="w-full border-divider hover:bg-default-100/50 font-semibold h-12 text-sm" 
            onClick={handleGoogleSignIn}
            isLoading={isGoogleLoading}
            startContent={!isGoogleLoading && (
              <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.107C18.28 1.84 15.45 1 12.24 1 6.01 1 1 6.01 1 12.24s5.01 11.24 11.24 11.24c6.5 0 10.82-4.57 10.82-11.02 0-.74-.08-1.3-.18-1.885H12.24Z"
                />
              </svg>
            )}
          >
            Google Sign In
          </Button>
        </form>

        <div className="text-center text-sm border-t border-divider/40 pt-6">
          <span className="text-default-500">Don't have an account? </span>
          <Link as={NextLink} href="/register" size="sm" className="font-semibold text-primary hover:underline">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
