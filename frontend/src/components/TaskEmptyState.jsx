import { Card } from "./ui/card";
import { Circle } from "lucide-react";

const TaskEmptyState = ({ filter }) => {
  return (
    <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
      <div className="space-y-3">
        <Circle className="size-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="font-medium text-foreground">
            {filter === "active"
              ? "Không có công việc đang hoạt động"
              : filter === "completed"
                ? "Không có công việc đã hoàn thành"
                : "Không có công việc nào"}
          </h3>

          <p className="text-sm text-muted-foreground">
            {filter === "active"
              ? "Hãy thêm một công việc mới để bắt đầu"
              : `Chuyển sang "tất cả" để xem tất cả công việc của bạn ${filter === "active" ? "đã hoàn thành" : "đang hoạt động"}`}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TaskEmptyState;
