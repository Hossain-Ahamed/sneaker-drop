import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DropAPI } from "../api";
import { DropCard } from "../components/DropCard";

function DropListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default function DropList() {
  const { data: drops, isPending, isError, error } = DropAPI.useDrops();

  if (isPending) return <DropListSkeleton />;

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load drops</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!drops.length) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium">No drops yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create one with POST /drops to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {drops.map((drop) => (
        <DropCard key={drop.id} drop={drop} />
      ))}
    </div>
  );
}
