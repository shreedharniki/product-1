import express from "express"
// import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import pool from "./config/database"
const app = express()

app.use(helmet())

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// )

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

app.use(morgan("dev"))

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TMS backend is running",
  })
})

app.get("/databaseconnectivity", async (_req, res) => {
  try {
    const connection = await pool.getConnection()

    await connection.ping()
    connection.release()

    res.status(200).json({
      success: true,
      message: "TMS database connectivity is working",
    })
  } catch (error) {
    console.error("Database connectivity error:", error)

    res.status(500).json({
      success: false,
      message: "TMS database connectivity failed",
    })
  }
})

app.get("/api/v1", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TMS API v1",
  })
})

export default app