import Test from "../models/Test.js";

export const getAllTest = async (req, res) => {
    try {
        const result = await Test.aggregate([{
            $facet: {
                task: [{ $sort: { createdAt: -1 } }],
                activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
                completeCount: [{ $match: { status: "complete" } }, { $count: "count" }]
            }
        }])

        const tasks = result[0].task;
        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;



        res.status(200).json({ tasks, activeCount, completeCount });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
};

export const createTest = async (req, res) => {
    try {
        const { title } = req.body;
        const test = new Test({ title });

        const newTest = await test.save();
        res.status(201).json(newTest);
    }
    catch (error) {
        console.error("Lỗi khi gọi createTest:", error);
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
};

export const updateTest = async (req, res) => {
    try {
        const { title, status, completeAt } = req.body;
        const updatedTest = await Test.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completeAt
            },
            { new: true });

        if (!updatedTest) {
            return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
        }
        res.status(200).json(updatedTest);

    } catch (error) {
        console.error("Lỗi khi cập nhật nhiệm vụ:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật nhiệm vụ" });
    }
}

export const deleteTest = async (req, res) => {
    try {
        const deletedTest = await Test.findByIdAndDelete(req.params.id);
        if (!deletedTest) {
            return res.status(404).json({ message: "Không tìm thấy nhiệm vụ" });
        }
        res.status(200).json({ message: "Nhiệm   vụ đã được xóa thành công" });

    } catch (error) {
        console.error("Lỗi khi xóa nhiệm vụ:", error);
        res.status(500).json({ message: "Lỗi khi xóa nhiệm vụ" });
    }
}