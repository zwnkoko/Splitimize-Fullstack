import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginCard } from "@/components/shared/login-card";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 md:max-w-xl">
        <DialogTitle className="sr-only">Login form</DialogTitle>
        <DialogDescription className="sr-only">
          Sign in to Splitimize to access your tools and apps
        </DialogDescription>
        <LoginCard />
      </DialogContent>
    </Dialog>
  );
}
