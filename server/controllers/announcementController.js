import Announcement from "../models/Announcement.js";

class AnnouncementController {
  // Create a new announcement
  async create(req, res) {
    try {
      const { title, content, postedBy } = req.body;

      const announcement = await Announcement.create({
        title,
        content,
        postedBy,
      });

      res.status(201).json({ success: true, data: announcement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all announcements
  async getAll(req, res) {
    try {
      const announcements = await Announcement.find().populate("postedBy", "name profilePic email");
      res.status(200).json({ success: true, data: announcements });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get a single announcement by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const announcement = await Announcement.findById(id);
      if (!announcement) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      res.status(200).json({ success: true, data: announcement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update announcement
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (!updatedAnnouncement) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      res.status(200).json({ success: true, data: updatedAnnouncement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete announcement
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Announcement.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Not found" });
      }
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AnnouncementController();
