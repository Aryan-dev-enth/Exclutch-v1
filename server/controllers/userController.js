import User from "../models/User.js";

class UserController {
    static hello = async (req, res) => {
        res.send("Hello, this is Exclutch API!");
    };

    // User Registration
    static register = async (req, res) => {
        try {
            const { uid, name, email, profilePic } = req.body;
            console.log(req.body);
            const userFound = await User.findOne({ uid });

            if (userFound) {
                return res.json({ message: "User already exists!",
                    data: userFound
                 });
            }

            const newUser = new User({
                uid,
                name,
                email,
                profilePic,
                role: "user",  // Default role
                status: "active" // Default status
            });

            const registerUser = await newUser.save();
            res.status(201).json({
                message: "User registered successfully!",
                data: registerUser
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    // Get User by ID
    static getUserById = async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await User.findOne({ uid });

            if (!user) {
                return res.status(404).json({ message: "No user found" });
            }

            return res.json({ message: "User found successfully", data: user });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    // Get All Users
    static getUsers = async (req, res) => {
        try {
            const users = await User.find();
            return res.json({ message: "Users retrieved successfully", data: users });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    // Update User Info (User can update their profile)
    static updateUser = async (req, res) => {
        try {
            const { uid } = req.params;
            const updates = req.body;  // Allow updating name, profilePic, etc.

            const updatedUser = await User.findOneAndUpdate({ uid }, updates, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.json({ message: "User updated successfully", data: updatedUser });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    // Change User Role (Only Admins)
    static changeRole = async (req, res) => {
        try {
            const { uid } = req.params;
            const { newRole } = req.body;
            const adminUid = req.user.uid;  // Assuming middleware sets req.user

            const adminUser = await User.findOne({ uid: adminUid });

            if (adminUser.role !== "admin") {
                return res.status(403).json({ message: "Only admins can change roles" });
            }

            const updatedUser = await User.findOneAndUpdate(
                { uid },
                { role: newRole },
                { new: true }
            );

            return res.json({ message: "User role updated", data: updatedUser });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };

    // Change User Status (Ban or Delete)
    static changeStatus = async (req, res) => {
        try {
            const { uid } = req.params;
            const { status } = req.body; // "active", "banned", "deleted"
            const adminUid = req.user.uid;

            const adminUser = await User.findOne({ uid: adminUid });

            if (adminUser.role !== "admin") {
                return res.status(403).json({ message: "Only admins can change status" });
            }

            const updatedUser = await User.findOneAndUpdate(
                { uid },
                { status },
                { new: true }
            );

            return res.json({ message: `User status changed to ${status}`, data: updatedUser });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };
}

export default UserController;
