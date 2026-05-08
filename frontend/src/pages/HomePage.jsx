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

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/test");
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
      console.log(activeTaskCount, completeTaskCount);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  };

  const handleTaskChanged = () => {
    fetchTasks();
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
