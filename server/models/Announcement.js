// models/Announcement.js

import mongoose from "mongoose"

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
)

const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema)

export default Announcement
