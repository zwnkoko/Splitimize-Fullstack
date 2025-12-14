"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthButton() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const isAuthenticated = !!session || isDemoMode;

  useEffect(() => {
    setIsDemoMode(localStorage.getItem("splitimize_demo") === "true");
  }, []);

  const signOutHandler = async () => {
    if (isDemoMode) {
      localStorage.removeItem("splitimize_demo");
      setIsDemoMode(false);
      router.push("/login");
      return;
    }
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  // show loading state while session is pending
  // this is useful for the initial load when the session is being fetched
  if (isPending) {
    return (
      <Button variant="secondary" className="w-full md:w-24" disabled>
        Loading...
      </Button>
    );
  }

  // if the user is authenticated, show the user avatar and sign out button
  // in development mode, the avatar may not show user profile image
  // because component is rendered twice due to strict mode and server(google, github) may reject instantaneous double requests
  if (isAuthenticated) {
    const displayName = isDemoMode
      ? "Demo User"
      : session?.user?.name || "User";
    const displayImage = isDemoMode ? undefined : session?.user?.image;

    return (
      <>
        <div className="hidden md:flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-7 h-7">
                <Avatar className="w-7 h-7">
                  <AvatarImage
                    key={displayImage}
                    src={displayImage || undefined}
                    alt="profile picture"
                  />
                  <AvatarFallback>
                    {isDemoMode ? "D" : <CircleUserRound />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuLabel>
                {isDemoMode ? "Demo Account" : "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOutHandler}>
                {isDemoMode ? "Exit Demo" : "Sign Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button className="w-full md:hidden" onClick={signOutHandler}>
          {isDemoMode ? "Exit Demo" : "Sign Out"}
        </Button>
      </>
    );
  }

  // if the user is not authenticated, show the sign in button
  return (
    <Button
      className="w-full md:w-24"
      onClick={() => {
        router.push("/login");
      }}
    >
      Sign In
    </Button>
  );
}
