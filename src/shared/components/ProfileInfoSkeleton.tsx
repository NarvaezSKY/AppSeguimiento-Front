import { Card, CardHeader, Chip } from "@heroui/react";

export function ProfileInfoSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-4">
        <div className="h-32 w-32 rounded-full bg-default-200 animate-pulse" />
        <div className="space-y-3">
          <div className="h-7 w-56 rounded bg-default-200 animate-pulse" />
          <div className="flex items-center gap-2">
            <Chip color="primary" className="text-white" size="sm">
              <div className="h-4 w-16 rounded bg-default-200 animate-pulse" />
            </Chip>
            <div className="h-4 w-40 rounded bg-default-200 animate-pulse" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
