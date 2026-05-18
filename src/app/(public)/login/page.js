'use client';

import { Input, Button, Link, Divider } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // redirect to home after login
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-content1 p-8 rounded-2xl shadow-xl border border-divider">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-default-500">
            Sign in to manage your bookings and rentals.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              type="email"
              label="Email Address"
              variant="bordered"
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              variant="bordered"
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button color="primary" className="w-full" size="lg" type="submit" isLoading={isLoading}>
            Sign In
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Divider className="w-full" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-content1 text-default-500">Or continue with</span>
            </div>
          </div>

          <Button variant="bordered" className="w-full" size="lg" onPress={handleGoogleSignIn}>
            Google
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-default-500">Don't have an account? </span>
          <Link href="/register" size="sm" color="primary">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
