import { Card, CardBody, CardHeader, Chip } from "@heroui/react";

export function EvidenceCardSkeleton() {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 w-full">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-5 w-3/4 rounded bg-default-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-default-200 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-default-200 animate-pulse" />
          </div>
          <Chip variant="flat" size="sm" className="shrink-0">
            <div className="h-4 w-16 rounded bg-default-200 animate-pulse" />
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-default-200 animate-pulse" />
          <div className="h-4 w-12 rounded bg-default-200 animate-pulse" />
          <div className="h-6 w-24 rounded bg-default-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-default-200 animate-pulse" />
            <div className="h-4 w-16 rounded bg-default-200 animate-pulse" />
            <div className="h-4 w-24 rounded bg-default-200 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-default-200 animate-pulse" />
            <div className="h-4 w-20 rounded bg-default-200 animate-pulse" />
            <div className="h-4 w-20 rounded bg-default-200 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-default-200 animate-pulse" />
            <div className="h-4 w-28 rounded bg-default-200 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 bg-default-100 rounded-lg px-3 py-2"
              >
                <div className="h-8 w-8 rounded-full bg-default-200 animate-pulse" />
                <div className="flex flex-col gap-1">
                  <div className="h-3 w-20 rounded bg-default-200 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-default-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-divider">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-36 rounded bg-default-200 animate-pulse" />
            <div className="h-3 w-28 rounded bg-default-200 animate-pulse" />
          </div>
          <div className="h-9 w-32 rounded border border-default-200 bg-default-100 animate-pulse" />
        </div>
      </CardBody>
    </Card>
  );
}
