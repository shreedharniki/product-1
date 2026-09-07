
import dotenv from "dotenv"

dotenv.config()

export const env = {
  port: Number(process.env.PORT) || 5002,
  nodeEnv: process.env.NODE_ENV || "development",

  dbHost: process.env.DB_HOST || "localhost",
  dbPort: Number(process.env.DB_PORT) || 3306,
  dbUser: process.env.DB_USERNAME || "",
  dbPassword: process.env.DB_PASSWORD || "",
  dbName: process.env.DB_NAME || "",

  jwtSecret: process.env.JWT_SECRET || "",
}