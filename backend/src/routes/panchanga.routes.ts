import { Router } from "express";
import express from "express";
import { getPanchang } from "../controllers/panchangaController";

const router = Router();

router.get("/", getPanchang);

export default router;