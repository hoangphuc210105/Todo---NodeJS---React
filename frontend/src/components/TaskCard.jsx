import {
  Calendar,
  CheckCircle2,
  Circle,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

const TaskCard = ({ task, index, handleTaskChanged }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      updateTask();
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      toast.success("Nhiệm vụ đã xóa.");
      handleTaskChanged();
    } catch (error) {
      console.log("Lỗi xảy ra khi xóa Task." + error);
      toast.error("Lỗi xảy ra khi xóa Task.");
    }
  };

  const updateTask = async () => {
    try {
      setIsEditing(false);
      const { error } = await supabase
        .from("tasks")
        .update({ title: updateTaskTitle })
        .eq("id", task._id);

      if (error) throw error;

      toast.success(`Nhiệm vụ đã đổi thành ${updateTaskTitle}`);
      handleTaskChanged();
    } catch (error) {
      console.log("Lỗi xảy ra khi update Task." + error);
      toast.error("Lỗi xảy ra khi cập nhật Task.");
    }
  };

  const toggleTaskCompleteButton = async () => {
    try {
      const isCompleted = task.status === "active";
      const { error } = await supabase
        .from("tasks")
        .update({
          status: isCompleted ? "completed" : "active",
          completeAt: isCompleted ? new Date().toISOString() : null,
        })
        .eq("id", task._id);

      if (error) throw error;

      if (isCompleted) {
        toast.success(`${task.title} đã hoàn thành`);
      } else {
        toast.success(`${task.title} đã đổi sang chưa hoàn thành`);
      }
      handleTaskChanged();
    } catch (error) {
      console.log("Lỗi xảy ra khi thay đổi Task." + error);
      toast.error("Lỗi xảy ra khi thay đổi Task");
    }
  };

  return (
    <Card
      className={cn(
        "p-4 border-0 bg-gradient-card shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "completed" && "opacity-75",
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* nút tròn */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "completed"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={toggleTaskCompleteButton}
        >
          {task.status === "completed" ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/* hiển thị nội dung */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              placehoder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20 "
              type="text"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                setIsEditing(false);
                setUpdateTaskTitle(task.title || "");
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-foreground",
              )}
            >
              {task.title}
            </p>
          )}
          {/* Ngày tạo & ngày hoàn thành */}
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
            {task.completeAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(task.completeAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Nút chỉnh và xóa */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* Nút edit */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditing(true);
              setUpdateTaskTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4 " />
          </Button>

          {/* Nút delete */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4 " />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
