import { Router } from "express";
import matches from "./matches";

const router = Router();

router.use('/matches', matches)

export default router;