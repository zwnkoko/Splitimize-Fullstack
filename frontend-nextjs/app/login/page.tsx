"use client";

import { LoginCard } from "@/components/shared/login-card";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // If OAuth sign-in succeeds and a session is present, redirect to upload page
  useEffect(() => {
    if (!isPending && session) {
      router.replace("/upload-receipt");
    }
  }, [isPending, session, router]);

  return (
    <div className="flex size-full items-center justify-center">
      <div className="md:w-lg">
        <LoginCard />
      </div>
    </div>
  );
}
