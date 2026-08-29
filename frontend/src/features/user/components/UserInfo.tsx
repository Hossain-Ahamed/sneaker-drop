import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useReservationStore } from "@/features/reservation";
import { UserAPI } from "../api";
import { SignInDialog } from "./SignInDialog";

export function UserInfo() {
  const { data: user, isPending } = UserAPI.useCurrentUser();
  const { mutate: signOut, isPending: isSigningOut } =
    UserAPI.useSignOutMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const releaseAll = useReservationStore((state) => state.clearAllReservations);

  // one stable wrapper for every state — swapping between structurally
  // different trees here crashed React's reconciler mid-commit while sonner
  // was mutating its own portal ("insertBefore ... not a child of this node")
  return (
    <div className="flex items-center gap-2">
      {isPending ? (
        <Skeleton className="h-8 w-32" />
      ) : user ? (
        <>
          <div className="text-right">
            <p className="text-sm font-medium leading-tight">{user.name}</p>
            <Badge variant="outline" className="mt-0.5">
              @{user.username}
            </Badge>
          </div>

          <Button
            size="sm"
            variant="ghost"
            disabled={isSigningOut}
            onClick={() =>
              signOut(undefined, {
                onSuccess: () => {
                  // holds belong to the identity that just went away
                  releaseAll();
                  toast.success("Signed out");
                },
                onError: (error) => toast.error(error.message),
              })
            }
          >
            Sign out
          </Button>
        </>
      ) : (
        <Button size="sm" onClick={() => setIsDialogOpen(true)}>
          Sign in
        </Button>
      )}

      {/* keyed on each opening so the dialog remounts fresh at sign-in mode,
          however the previous visit happened to close */}
      <SignInDialog
        key={String(isDialogOpen)}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
