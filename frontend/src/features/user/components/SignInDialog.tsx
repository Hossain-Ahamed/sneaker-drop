import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAPI } from "../api";

type SignInDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Mode = "signin" | "signup";

/** Signs an existing user in by username, or creates a new one */
export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const isSignUp = mode === "signup";

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const { mutate: signIn, isPending: isSigningIn } =
    UserAPI.useSignInMutation();
  const { mutate: createUser, isPending: isCreating } = UserAPI.useCreateUser();

  const isPending = isSigningIn || isCreating;

  const finishSignInProcess = (welcome: string) => {
    toast.success(welcome);
    onOpenChange(false);
    setUsername("");
    setName("");
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setName("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedUsername = username.trim();

    if (isSignUp) {
      createUser(
        { username: trimmedUsername, name: name.trim() },
        {
          onSuccess: (user) => finishSignInProcess(`Welcome, ${user.name}`),
          onError: (error) => toast.error(error.message),
        },
      );
      return;
    }

    signIn(
      { username: trimmedUsername },
      {
        onSuccess: (user) => finishSignInProcess(`Welcome back, ${user.name}`),
        onError: (error) => {
          if (error.statusCode === 404) {
            setMode("signup");
            toast.error("No user found. Create an account?");
            return;
          }
          toast.error(error.message);
        },
      },
    );
  };

  const isFormValid =
    username.trim().length > 0 && (!isSignUp || name.trim().length > 0);

  // alternate to switch between sign up and sign in
  const handleOpenChange = (switching: boolean) => {
    if (!switching) {
      setMode("signin");
      setUsername("");
      setName("");
    }
    onOpenChange(switching);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isSignUp ? "Create an account" : "Welcome back"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="hossain.ahamed"
                autoComplete="off"
                autoFocus
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Letters, numbers, dots, underscores and hyphens.
                </p>
              )}
            </div>

            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Hossain Ahamed"
                  autoComplete="off"
                />
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={() => switchMode(isSignUp ? "signin" : "signup")}
            >
              {isSignUp ? "I already have an account" : "Create an account"}
            </Button>

            <Button type="submit" disabled={!isFormValid || isPending}>
              {isPending
                ? isSignUp
                  ? "Creating…"
                  : "Signing in…"
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
