import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isBefore, isWithinInterval, addDays } from "date-fns";
import { Clock } from "lucide-react";

interface Task {
  title: string;
  status: "todo" | "in-progress" | "done";
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string[];
  taskDue: Date;
}

const statusColorMap = {
  todo: "bg-red-500",
  "in-progress": "bg-yellow-500",
  done: "bg-green-500",
};

export default function TaskCard() {
  const task: Task = {
    title: "Task 1",
    status: "in-progress",
    createdAt: new Date("2025-05-07T12:31:29.652Z"),
    updatedAt: new Date("2025-05-07T18:14:21.460Z"),
    assignedTo: ["User123"],
    taskDue: new Date("2025-05-10T10:00:00.000Z"),
  };

  const isDueSoon = isWithinInterval(task.taskDue, {
    start: new Date(),
    end: addDays(new Date(), 2),
  });

  const isOverdue = isBefore(task.taskDue, new Date());

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
          <div className="text-xs text-muted-foreground">
            Assigned to: {task.assignedTo.join(", ")}
          </div>
        </div>
        <span
          className={`w-3 h-3 rounded-full ${statusColorMap[task.status]}`}
          title={task.status}
        />
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>
            Due:{" "}
            <span
              className={
                isOverdue
                  ? "text-red-500 font-medium"
                  : isDueSoon
                    ? "text-yellow-600 font-medium"
                    : "text-neutral-700 dark:text-neutral-300"
              }
            >
              {format(task.taskDue, "PPP p")}
            </span>
          </span>
        </div>
        <Badge variant="outline" className="capitalize">
          {task.status}
        </Badge>
      </CardContent>
    </Card>
  );
}
