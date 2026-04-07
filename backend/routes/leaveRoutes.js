import express from "express"
import Leave from "../models/Leave.js"

const router = express.Router()

router.post("/apply", async (req, res) => {
  try {
    const { studentEmail, reason, fromDate, toDate } = req.body

    if (!studentEmail || !reason || !fromDate || !toDate) {
      return res.status(400).json({ message: "All fields are required" })
    }

    const leave = await Leave.create({
      studentEmail,
      reason,
      fromDate,
      toDate,
    })

    res.status(201).json(leave)
  } catch (error) {
    res.status(500).json({ message: "Failed to apply leave", error: error.message })
  }
})

router.get("/", async (_req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 })
    res.json(leaves)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaves", error: error.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" })
    }

    res.json(leave)
  } catch (error) {
    res.status(500).json({ message: "Failed to update leave", error: error.message })
  }
})

export default router
