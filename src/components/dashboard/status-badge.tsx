import { Badge } from "@/components/ui/badge";
import type { StatusValue } from "@/lib/constants";
import { STATUSES } from "@/lib/constants";

interface StatusBadgeProps {
  status: StatusValue;
}

const variantMap: Record<StatusValue, "default" | "secondary" | "destructive"> = {
  OPEN: "destructive",
  ON_PROGRESS: "default",
  CLOSED: "secondary",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const item = STATUSES.find((s) => s.value === status);
  return (
    <Badge variant={variantMap[status]} className="text-xs">
      {item?.label ?? status}
    </Badge>
  );
}
