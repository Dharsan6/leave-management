import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import leaveRoutes from "./routes/leaveRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001
const { MONGO_URI } = process.env

const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000", "http://localhost:5173"]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS policy blocked request from ${origin}`))
      }
    },
  })
)
app.use(express.json())

app.use("/api/leaves", leaveRoutes)

app.get("/", (_req, res) => {
  res.json({ message: "Leave Management API running" })
})

const connectDatabase = async () => {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env")
  }

  if (!MONGO_URI.startsWith("mongodb+srv://")) {
    throw new Error("MONGO_URI must use the MongoDB Atlas mongodb+srv:// format")
  }

  await mongoose.connect(MONGO_URI)
  console.log("MongoDB Atlas connected")
}

const startServer = async () => {
  try {
    await connectDatabase()

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`)
        process.exit(1)
      }

      console.error("Server failed to start:", error.message)
      process.exit(1)
    })
  } catch (error) {
    console.error("Startup failed:", error.message)
    process.exit(1)
  }
}

startServer()
