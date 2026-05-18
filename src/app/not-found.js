"use client";

import { Button, Link } from "@heroui/react";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="bg-danger/10 p-4 rounded-full mb-6">
        <AlertCircle className="w-16 h-16 text-danger" />
      </div>
      <h1 className="text-6xl font-black mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-default-500 mb-8 max-w-md mx-auto">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <Button as={Link} href="/" color="primary" size="lg">
        Back to Home
      </Button>
    </div>
  );
}
