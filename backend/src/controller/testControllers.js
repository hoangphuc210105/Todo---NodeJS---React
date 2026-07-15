import { supabase } from "../config/supabase.js";

// Helper to map Supabase database record to expected frontend representation
const mapTask = (task) => {
    if (!task) return null;
    return {
        ...task,
        _id: task.id, // Map database `id` to `_id` expected by the frontend
    };
};

export const getAllTest = async (req, res) => {
    try {
        // Query tasks from Supabase sorted by "createdAt" descending
        const { data: tasks, error } = await supabase
            .from("tasks")
            .select("*")
            .order("createdAt", { ascending: false });

        if (error) throw error;

        const mappedTasks = (tasks || []).map(mapTask);
        const activeCount = mappedTasks.filter(t => t.status === "active").length;
        const completeCount = mappedTasks.filter(t => t.status === "completed" || t.status === "complete").length;

        res.status(200).json({ tasks: mappedTasks, activeCount, completeCount });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
};

export const createTest = async (req, res) => {
    try {
        const { title } = req.body;
        const { data, error } = await supabase
            .from("tasks")
            .insert([{ title, status: "active" }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(mapTask(data));
    }
    catch (error) {
        console.error("Lỗi khi gọi createTest:", error);
        res.status(500).json({ message: "Lỗi khi thêm nhiệm vụ" });
    }
};

export const updateTest = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const { title, status, completeAt } = req.body;
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (status !== undefined) updateData.status = status;
        if (completeAt !== undefined) updateData.completeAt = completeAt;

        const { data, error } = await supabase
            .from("tasks")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Supabase error during update:", error);
            if (error.code === "PGRST116") {
                return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
            }
            throw error;
        }

        if (!data) {
            return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
        }

        res.status(200).json(mapTask(data));

    } catch (error) {
        console.error("Lỗi khi cập nhật nhiệm vụ:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật nhiệm vụ" });
    }
}

export const deleteTest = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const { data, error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
            }
            throw error;
        }

        res.status(200).json({ message: "Nhiệm vụ đã được xóa thành công" });

    } catch (error) {
        console.error("Lỗi khi xóa nhiệm vụ:", error);
        res.status(500).json({ message: "Lỗi khi xóa nhiệm vụ" });
    }
}