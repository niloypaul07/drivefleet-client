'use client';

import { Spinner } from "@heroui/react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-background/60 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500 font-medium text-sm animate-pulse">Loading DriveFleet...</p>
      </div>
    </div>
  );
}
