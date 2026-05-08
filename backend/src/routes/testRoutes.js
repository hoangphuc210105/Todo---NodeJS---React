import express from 'express';
import { createTest, getAllTest, updateTest, deleteTest } from '../controller/testControllers.js';

const router = express.Router();

router.get("/", getAllTest);

router.post("/", createTest);

router.put("/:id", updateTest);

router.delete("/:id", deleteTest);

export default router;