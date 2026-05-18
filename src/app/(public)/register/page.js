'use client';

import { Input, Button, Link, Divider } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Mail, Lock, User, Image, Check, ArrowRight, CarFront } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const router = useRouter();

  // Password validation state checks
  const passHasMinLength = password.length >= 6;
  const passHasUppercase = /[A-Z]/.test(password);
  const passHasLowercase = /[a-z]/.test(password);
  const isPasswordValid = passHasMinLength && passHasUppercase && passHasLowercase;

  const handleRegister = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!isPasswordValid) {
      toast.error("Please satisfy all password criteria before registering.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: photoURL || "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.success("Registration successful! Welcome to the family.");
        router.push("/login");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // redirect to home after login
      });
    } catch (err) {
      toast.error("Google registration failed.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-[95vh] flex items-center justify-center py-16 px-4 overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[7s]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[9s]" />

      <div className="relative max-w-md w-full bg-content1/40 backdrop-blur-xl border border-divider/60 p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <CarFront className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-sm text-default-500 max-w-xs mx-auto">
            Join DriveFleet today to explore and book a world-class selection of luxury and daily vehicles.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-4">
            <Input
              type="text"
              label="Full Name"
              placeholder="John Doe"
              variant="bordered"
              isRequired
              value={name}
              onChange={(e) => setName(e.target.value)}
              startContent={<User className="w-4 h-4 text-default-400" />}
              classNames={{
                inputWrapper: "border-divider/60 hover:border-primary/50 focus-within:!border-primary transition-all duration-200"
              }}
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="john@example.com"
              variant="bordered"
              isRequired
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              classNames={{
                inputWrapper: "border-divider/60 hover:border-primary/50 focus-within:!border-primary transition-all duration-200"
              }}
            />
            <Input
              type="url"
              label="Photo URL (Optional)"
              placeholder="https://example.com/avatar.jpg"
              variant="bordered"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              startContent={<Image className="w-4 h-4 text-default-400" />}
              classNames={{
                inputWrapper: "border-divider/60 hover:border-primary/50 focus-within:!border-primary transition-all duration-200"
              }}
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              variant="bordered"
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startContent={<Lock className="w-4 h-4 text-default-400" />}
              isInvalid={hasSubmitted && !isPasswordValid}
              errorMessage={hasSubmitted && !isPasswordValid ? "Please satisfy all requirements below." : ""}
              classNames={{
                inputWrapper: "border-divider/60 hover:border-primary/50 focus-within:!border-primary transition-all duration-200"
              }}
            />

            {/* Live Password Validation Checklist */}
            <div className="space-y-2 p-4 bg-default-50/40 rounded-2xl border border-divider/40 text-xs transition-all duration-300">
              <p className="font-semibold text-default-600 mb-1">Password Requirements:</p>
              <div className="flex items-center gap-2.5">
                <span className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${passHasMinLength ? 'bg-success/20 border-success text-success scale-110 shadow-sm' : 'border-default-300 text-default-400'}`}>
                  <Check className="w-3 h-3" />
                </span>
                <span className={`transition-colors duration-300 ${passHasMinLength ? 'text-success font-semibold' : 'text-default-500'}`}>
                  Length must be at least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${passHasUppercase ? 'bg-success/20 border-success text-success scale-110 shadow-sm' : 'border-default-300 text-default-400'}`}>
                  <Check className="w-3 h-3" />
                </span>
                <span className={`transition-colors duration-300 ${passHasUppercase ? 'text-success font-semibold' : 'text-default-500'}`}>
                  Must have an Uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`flex items-center justify-center w-4 h-4 rounded-full border transition-all duration-300 ${passHasLowercase ? 'bg-success/20 border-success text-success scale-110 shadow-sm' : 'border-default-300 text-default-400'}`}>
                  <Check className="w-3 h-3" />
                </span>
                <span className={`transition-colors duration-300 ${passHasLowercase ? 'text-success font-semibold' : 'text-default-500'}`}>
                  Must have a Lowercase letter (a-z)
                </span>
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
            Register Account
          </Button>

          <div className="relative my-6 flex items-center justify-center">
            <Divider className="absolute w-full bg-divider/40" />
            <span className="relative px-3 bg-background text-xs uppercase tracking-wider text-default-400 font-semibold z-10">
              Or continue with
            </span>
          </div>

          <Button 
            variant="bordered" 
            className="w-full border-divider/60 hover:bg-default-100/50 font-semibold h-12 text-sm" 
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

        <div className="text-center text-sm mt-8 border-t border-divider/40 pt-6">
          <span className="text-default-500">Already have an account? </span>
          <Link as={NextLink} href="/login" size="sm" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
