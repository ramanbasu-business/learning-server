// learning-server/routes/userRoutes
import { userService } from '../services/userService'
import express from "express";


const userRouters = express.Router();

// GET /api/users
userRouters.get('/', async (request, response) => {
    try {
        const users = await userService.getUsers();  // ✅ await
        return response.json(users);                 // ✅ pass users
    } catch (err) {
        console.error(err);
        response.status(500).json({ error: "Failed to fetch users", err });
    }

    return null;
});

userRouters.post("/auth", async (request, response) => {
    try {
        const { username, password } = request.body;

        if (!username || !password) {
            return response.status(400).json({ error: "Username and password are required" });
        }

        const user = await userService.getUserByLogin(username, password);

        if (!user) {
            return response.status(401).json({ error: "Invalid username or password" });
        }

        return response.json({ message: "Login successful", user });
    } catch (err) {
        console.error(err);
        return response.status(500).json({ error: "Authentication failed", err });
    }
});

export default userRouters;
