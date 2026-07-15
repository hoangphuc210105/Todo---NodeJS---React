import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatusAndFilter from "@/components/StatusAndFilter";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Derive counts from taskBuffer
  const activeTaskCount = taskBuffer.filter((t) => t.status === "active").length;
  const completeTaskCount = taskBuffer.filter(
    (t) => t.status === "completed" || t.status === "complete"
  ).length;

  useEffect(() => {
    fetchTasks();

    // Thiết lập Supabase Realtime subscription
    const channel = supabase
      .channel("tasks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newTask = { ...payload.new, _id: payload.new.id };
            setTaskBuffer((prev) => {
              if (prev.some((t) => t._id === newTask._id)) return prev;
              return [newTask, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedTask = { ...payload.new, _id: payload.new.id };
            setTaskBuffer((prev) =>
              prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            setTaskBuffer((prev) => prev.filter((t) => t._id !== deletedId));
          }
        }
      )
      .subscribe();

    // Hủy subscription khi component bị unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) throw error;

      const mappedTasks = (data || []).map((task) => ({
        ...task,
        _id: task.id,
      }));
      setTaskBuffer(mappedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  };

  const handleTaskChanged = () => {
    // No-op because Supabase Realtime will automatically catch the DB changes
    // and update local state in real-time.
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Biến
  const filteredTasks = taskBuffer.filter((test) => {
    switch (filter) {
      case "active":
        return test.status === "active";
      case "completed":
        return test.status === "completed";
      default:
        return true;
    }
  });

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit,
  );

  if (visibleTasks.length === 0) {
    handlePrev();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  return (
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background from Bottom */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #fff 40%, #475569 100%)",
        }}
      />
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
          {/* Đầu Trang */}
          <Header />

          {/* Nội Dung */}
          <AddTask handleNewTaskAdd={handleTaskChanged} />

          {/* Thống kê */}
          <StatusAndFilter
            filter={filter}
            setFilter={setFilter}
            activeTaskCount={activeTaskCount}
            completedTaskCount={completeTaskCount}
          />

          {/* Danh sách công việc */}
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          {/* Phân trang */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />

            <DateTimeFilter />
          </div>

          {/* Chân Trang */}
          <Footer
            activeTaskCount={activeTaskCount}
            completedTaskCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
