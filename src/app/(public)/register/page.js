'use client';

import { Input, Button, Link, Divider } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pass) => {
    if (pass.length < 6) return "Length must be at least 6 characters.";
    if (!/[A-Z]/.test(pass)) return "Must have an Uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Must have a Lowercase letter.";
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      return;
    }
    setPasswordError("");

    setIsLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
          email,
          password,
          name,
          image: photoURL || "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      });

      if (error) {
        toast.error(error.message || "Registration failed");
      } else {
        toast.success("Registration successful! Please login.");
        router.push("/login");
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
          <h2 className="text-3xl font-extrabold tracking-tight">Create an Account</h2>
          <p className="mt-2 text-sm text-default-500">
            Join DriveFleet and start your journey.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              variant="bordered"
              isRequired
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              label="Email Address"
              variant="bordered"
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="url"
              label="Photo URL"
              variant="bordered"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />
            <Input
              type="password"
              label="Password"
              variant="bordered"
              errorMessage={passwordError}
              isInvalid={!!passwordError}
              isRequired
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if(passwordError) setPasswordError(validatePassword(e.target.value));
              }}
              description="Must have uppercase, lowercase, and at least 6 characters."
            />
          </div>

          <Button color="primary" className="w-full" size="lg" type="submit" isLoading={isLoading}>
            Register
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
          <span className="text-default-500">Already have an account? </span>
          <Link href="/login" size="sm" color="primary">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
